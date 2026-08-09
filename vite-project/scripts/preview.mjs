import http from "node:http"
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const OUT = "/tmp/ims-preview"

const BASE = "http://127.0.0.1:5182"

const PAGES = [
  { name: "01-login", url: "/login", setup: null },
  {
    name: "02-products-list",
    url: "/products",
    setup: () => localStorage.setItem("ims.session", JSON.stringify({ id: "u1", username: "admin" })),
  },
  {
    name: "03-product-view",
    url: "/products",
    setup: () => {
      localStorage.setItem("ims.session", JSON.stringify({ id: "u1", username: "admin" }))
      const products = JSON.parse(localStorage.getItem("ims.products") || "[]")
      if (products[0]) location.assign(BASE + "/products/" + products[0].id)
    },
  },
  {
    name: "04-product-add",
    url: "/products/new",
    setup: () => localStorage.setItem("ims.session", JSON.stringify({ id: "u1", username: "admin" })),
  },
  {
    name: "05-product-edit",
    url: "/products",
    setup: () => {
      localStorage.setItem("ims.session", JSON.stringify({ id: "u1", username: "admin" }))
      const products = JSON.parse(localStorage.getItem("ims.products") || "[]")
      if (products[1]) location.assign(BASE + "/products/" + products[1].id + "/edit")
    },
  },
  {
    name: "06-suppliers-list",
    url: "/suppliers",
    setup: () => localStorage.setItem("ims.session", JSON.stringify({ id: "u1", username: "admin" })),
  },
  {
    name: "07-supplier-add",
    url: "/suppliers/new",
    setup: () => localStorage.setItem("ims.session", JSON.stringify({ id: "u1", username: "admin" })),
  },
]

function cdpSend(ws, id, method, params = {}) {
  return new Promise((resolve, reject) => {
    const onMessage = (raw) => {
      const msg = JSON.parse(raw.toString())
      if (msg.id === id) {
        ws.off("message", onMessage)
        if (msg.error) reject(new Error(msg.error.message))
        else resolve(msg.result)
      }
    }
    ws.on("message", onMessage)
    ws.send(JSON.stringify({ id, method, params }))
  })
}

async function main() {
  const { WebSocket } = await import("ws").catch(() => ({ WebSocket: null }))
  if (!WebSocket) {
    console.error("ws package not available")
    process.exit(1)
  }

  fs.mkdirSync(OUT, { recursive: true })

  for (const page of PAGES) {
    const target = await fetch("http://127.0.0.1:9222/json/new?about:blank").then((r) => r.json())
    const ws = new WebSocket(target.webSocketDebuggerUrl)
    await new Promise((r) => ws.on("open", r))

    let id = 0
    const send = (method, params) => cdpSend(ws, ++id, method, params)

    await send("Page.enable")
    await send("Runtime.enable")
    await send("Emulation.setDeviceMetricsOverride", {
      width: 1280,
      height: 900,
      deviceScaleFactor: 1,
      mobile: false,
    })

    const setup = page.setup ? `(${page.setup.toString()})()` : ""
    const navigateScript = `
      (async () => {
        ${setup}
        location.assign(${JSON.stringify(BASE + page.url)})
      })()
    `
    await send("Runtime.evaluate", { expression: navigateScript, awaitPromise: false })

    await new Promise((r) => setTimeout(r, 2500))

    const screenshot = await send("Page.captureScreenshot", { format: "png" })
    fs.writeFileSync(path.join(OUT, page.name + ".png"), Buffer.from(screenshot.data, "base64"))
    console.log("Wrote", page.name + ".png")

    ws.close()
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})