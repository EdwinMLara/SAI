import request from 'supertest';
import express, { Application } from 'express';
import createProduct from '../src/controllers/ProductsDB.controller';
import ProductDocument from '../src/models/Product.model';

import mockProduct from './mocks/ProductsDB.interface.mock';

jest.mock('../src/models/Product.model');
const app: Application = express();
app.use(express.json());
app.post('/api/products', createProduct);

describe('Test for create Product', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Create Product Successfully', async () => {
    (ProductDocument.prototype.save as jest.Mock).mockResolvedValue(
      mockProduct
    );

    const response = await request(app).post('/api/products').send(mockProduct);

    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      status: 201,
      message: 'Product created successfully.',
    });
  });

  it('Should return Bad Request if request body is invalid', async () => {
    const response = await request(app).post('/api/products').send({});

    expect(response.status).toBe(400);
    expect(response.body.message).toContain(
      'Bad Request. Request body must be a valid object.'
    );
  });

  it('Should return Internal Server Error on database error', async () => {
    (ProductDocument.prototype.save as jest.Mock).mockRejectedValue(
      new Error('DB Error')
    );

    const response = await request(app).post('/api/products').send(mockProduct);

    expect(response.status).toBe(500);
    expect(response.body.message).toContain(
      'Internal Server Error. Could not create product.'
    );
  });
});
