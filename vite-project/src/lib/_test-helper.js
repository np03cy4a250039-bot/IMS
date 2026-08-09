export function setSessionForTesting() {
  const session = { id: "admin-id", username: "admin" }
  localStorage.setItem("ims.session", JSON.stringify(session))
}