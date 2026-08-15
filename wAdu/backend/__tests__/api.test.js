const request = require('supertest');
const express = require('express');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const pool = require('../db');

process.env.JWT_SECRET = 'test-secret-key-for-testing-only';
process.env.NODE_ENV = 'test';

const app = express();
app.use(express.json());
app.use(cookieParser());

const authController = require('../controllers/authController');
const productController = require('../controllers/productController');
const supplierController = require('../controllers/supplierController');
const authMiddleware = require('../middleware/auth');

app.post('/api/auth/register', authController.register);
app.post('/api/auth/login', authController.login);
app.post('/api/auth/logout', authController.logout);
app.get('/api/auth/me', authMiddleware, (req, res) => res.json({ userId: req.userId }));

app.get('/api/products', authMiddleware, productController.getAllProducts);
app.get('/api/products/:id', authMiddleware, productController.getProductById);
app.post('/api/products', authMiddleware, productController.createProduct);
app.put('/api/products/:id', authMiddleware, productController.updateProduct);
app.delete('/api/products/:id', authMiddleware, productController.deleteProduct);

app.get('/api/suppliers', authMiddleware, supplierController.getAllSuppliers);
app.get('/api/suppliers/:id', authMiddleware, supplierController.getSupplierById);
app.post('/api/suppliers', authMiddleware, supplierController.createSupplier);
app.put('/api/suppliers/:id', authMiddleware, supplierController.updateSupplier);
app.delete('/api/suppliers/:id', authMiddleware, supplierController.deleteSupplier);

let testToken = '';
let testUserId = '';
let testSupplierId = '';
let testProductId = '';

beforeAll(async () => {
  await pool.query('DELETE FROM products');
  await pool.query('DELETE FROM suppliers');
  await pool.query('DELETE FROM users');
});

afterAll(async () => {
  await pool.end();
});

describe('Auth flow', () => {
  test('register new user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ username: 'testuser', password: 'password123' });
    expect(res.status).toBe(201);
    expect(res.body.user).toBeDefined();
    testUserId = res.body.user.id;
  });

  test('login with correct credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ username: 'testuser', password: 'password123' });
    expect(res.status).toBe(200);
    expect(res.headers['set-cookie']).toBeDefined();
    testToken = res.headers['set-cookie'][0].split(';')[0].split('=')[1];
  });

  test('GET /me with valid cookie', async () => {
    const res = await request(app)
      .get('/api/auth/me')
      .set('Cookie', [`token=${testToken}`]);
    expect(res.status).toBe(200);
    expect(res.body.userId).toBe(testUserId);
  });

  test('logout clears cookie', async () => {
    const res = await request(app)
      .post('/api/auth/logout')
      .set('Cookie', [`token=${testToken}`]);
    expect(res.status).toBe(200);
    expect(res.headers['set-cookie'][0]).toMatch(/token=;/);
  });
});

describe('Supplier CRUD', () => {
  test('create supplier', async () => {
    const res = await request(app)
      .post('/api/suppliers')
      .set('Cookie', [`token=${testToken}`])
      .send({ name: 'Test Supplier', email: 'test@example.com', phone: '1234567890' });
    expect(res.status).toBe(201);
    expect(res.body.supplier).toBeDefined();
    testSupplierId = res.body.supplier.id;
  });

  test('get all suppliers', async () => {
    const res = await request(app)
      .get('/api/suppliers')
      .set('Cookie', [`token=${testToken}`]);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  test('update supplier', async () => {
    const res = await request(app)
      .put(`/api/suppliers/${testSupplierId}`)
      .set('Cookie', [`token=${testToken}`])
      .send({ name: 'Updated Supplier' });
    expect(res.status).toBe(200);
    expect(res.body.supplier.name).toBe('Updated Supplier');
  });

  test('delete supplier', async () => {
    const res = await request(app)
      .delete(`/api/suppliers/${testSupplierId}`)
      .set('Cookie', [`token=${testToken}`]);
    expect(res.status).toBe(200);
  });
});

describe('Product CRUD', () => {
  test('create product', async () => {
    const res = await request(app)
      .post('/api/products')
      .set('Cookie', [`token=${testToken}`])
      .send({ name: 'Test Product', price: 10.5, quantity: 100 });
    expect(res.status).toBe(201);
    expect(res.body.product).toBeDefined();
    testProductId = res.body.product.id;
  });

  test('get all products', async () => {
    const res = await request(app)
      .get('/api/products')
      .set('Cookie', [`token=${testToken}`]);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  test('update product price to 0', async () => {
    const res = await request(app)
      .put(`/api/products/${testProductId}`)
      .set('Cookie', [`token=${testToken}`])
      .send({ price: 0 });
    expect(res.status).toBe(200);
    expect(res.body.product.price).toBe(0);
  });

  test('delete product', async () => {
    const res = await request(app)
      .delete(`/api/products/${testProductId}`)
      .set('Cookie', [`token=${testToken}`]);
    expect(res.status).toBe(200);
  });
});