import request from 'supertest';
import express, { Application } from 'express';
import createInvoice from '../src/controllers/Invoice.controller';
import InvoiceDocument from '../src/models/Invoice.model';

import mockInvoice from './mocks/Invoice.interface.mock';

jest.mock('../src/models/Invoice.model');
const app: Application = express();
app.use(express.json());
app.post('/api/invoice/new', createInvoice);

describe('Test for create Invoice', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Test for create Invoice', () => {
    it('Create Invoice Successfully', async () => {
      (InvoiceDocument.findOne as jest.Mock).mockResolvedValue(null);
      (InvoiceDocument.prototype.save as jest.Mock).mockResolvedValue({});

      const response = await request(app)
        .post('/api/invoice/new')
        .send(mockInvoice);

      expect(response.status).toBe(201);
      expect(response.body).toEqual({
        status: 201,
        message: 'Invoice created successfully.',
      });
    });

    it('Should invoice already exists', async () => {
      (InvoiceDocument.findOne as jest.Mock).mockResolvedValue(mockInvoice);

      const response = await request(app)
        .post('/api/invoice/new')
        .send(mockInvoice);

      expect(response.status).toBe(409);
      expect(response.body.message).toContain('Invoice already exists');
    });

    it('Should on server error', async () => {
      (InvoiceDocument.findOne as jest.Mock).mockRejectedValue(
        new Error('DB Error')
      );

      const response = await request(app)
        .post('/api/invoice/new')
        .send(mockInvoice);

      expect(response.status).toBe(500);
      expect(response.body.message).toContain('Internal Server Error');
    });
  });
});
