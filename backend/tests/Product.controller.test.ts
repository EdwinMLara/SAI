import request from 'supertest';
import express, { Application } from 'express';
import getProduct from '../src/controllers/Product.controller';
import ProductDocument from '../src/models/Product.model';

jest.mock('../src/models/Product.model');

const app: Application = express();
app.use(express.json());
app.get('/api/get-product', getProduct);

describe('Test for get Product', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Get Successfully Product', async () => {
    const testingMock = {
      key: 329322,
      description: 'Taladro 23 piezas',
      prices: {
        distribution: 100,
        wholesale: 150,
        mid_wholesale: 200,
        retail: 250,
      },
      toObject: jest.fn().mockReturnValue({
        key: 329322,
        description: 'Taladro 23 piezas',
        prices: {
          distribution: 100,
          wholesale: 150,
          mid_wholesale: 200,
          retail: 250,
        },
      }),
    };

    (ProductDocument.findOne as jest.Mock).mockResolvedValue(testingMock);

    const initTest = await request(app)
      .get('/api/get-product')
      .query({ key: 329322 });

    expect(initTest.status).toBe(200);
    expect(initTest.body).toEqual({
      message: 'Product found',
      product: testingMock.toObject(),
    });
  });

  it('Get Not Product', async () => {
    (ProductDocument.findOne as jest.Mock).mockResolvedValue(null);

    const initTest = await request(app)
      .get('/api/get-product')
      .query({ key: 320222 });

    expect(initTest.status).toBe(404);
    expect(initTest.body).toEqual({
      message: 'Product not found',
    });
  });

  it('Missing Key', async () => {
    const initTest = await request(app).get('/api/get-product').query({});

    expect(initTest.status).toBe(400);
    expect(initTest.body).toEqual({
      message: 'The search key was not received correctly.',
    });
  });

  it('Internal Server Error', async () => {
    (ProductDocument.findOne as jest.Mock).mockRejectedValue(
      new Error('Internal Server Error.')
    );

    const initTest = await request(app)
      .get('/api/get-product')
      .query({ key: 329322 });

    expect(initTest.status).toBe(500);
    expect(initTest.body).toEqual({
      message: 'Internal Server Error. Could not get product.',
    });
  });
});
