const mockInvoice = {
  invoice: 'INV12345',
  date: new Date('2023-10-01'),
  products: [
    {
      key: 'PROD001',
      description: 'Product 1 Description',
      quantity: 10,
      status: 'available',
      prices: {
        payment: 100,
        distribution: 90,
        wholesale: 80,
        mid_wholesale: 85,
        retail: 110,
      },
      user_config: [
        {
          name: 'Alice',
          role: 'manager',
          needs: 5,
          use: {
            use_factor: 'high',
            gain_factor: 1.5,
            pay: 50,
          },
        },
        {
          name: 'Bob',
          role: 'assistant',
          needs: 3,
          use: {
            use_factor: 'medium',
            gain_factor: 1.2,
            pay: 30,
          },
        },
      ],
    },
    {
      key: 'PROD002',
      description: 'Product 2 Description',
      quantity: 20,
      status: 'out_of_stock',
      prices: {
        payment: 200,
        distribution: 180,
        wholesale: 160,
        mid_wholesale: 170,
        retail: 220,
      },
      user_config: [
        {
          name: 'Charlie',
          role: 'supervisor',
          needs: 10,
          use: {
            use_factor: 'low',
            gain_factor: 1.1,
            pay: 100,
          },
        },
        {
          name: 'Dana',
          role: 'operator',
          needs: 7,
          use: {
            use_factor: 'medium',
            gain_factor: 1.3,
            pay: 70,
          },
        },
      ],
    },
  ],
  document: 'DOC12345',
  voucher: 'VOUCHER67890',
  toObject: jest.fn().mockReturnValue({
    invoice: 'INV12345',
    date: new Date('2023-10-01'),
    products: [
      {
        key: 'PROD001',
        description: 'Product 1 Description',
        quantity: 10,
        status: 'available',
        prices: {
          payment: 100,
          distribution: 90,
          wholesale: 80,
          mid_wholesale: 85,
          retail: 110,
        },
        user_config: [
          {
            name: 'Alice',
            role: 'manager',
            needs: 5,
            use: {
              use_factor: 'high',
              gain_factor: 1.5,
              pay: 50,
            },
          },
          {
            name: 'Bob',
            role: 'assistant',
            needs: 3,
            use: {
              use_factor: 'medium',
              gain_factor: 1.2,
              pay: 30,
            },
          },
        ],
      },
      {
        key: 'PROD002',
        description: 'Product 2 Description',
        quantity: 20,
        status: 'out_of_stock',
        prices: {
          payment: 200,
          distribution: 180,
          wholesale: 160,
          mid_wholesale: 170,
          retail: 220,
        },
        user_config: [
          {
            name: 'Charlie',
            role: 'supervisor',
            needs: 10,
            use: {
              use_factor: 'low',
              gain_factor: 1.1,
              pay: 100,
            },
          },
          {
            name: 'Dana',
            role: 'operator',
            needs: 7,
            use: {
              use_factor: 'medium',
              gain_factor: 1.3,
              pay: 70,
            },
          },
        ],
      },
    ],
    document: 'DOC12345',
    voucher: 'VOUCHER67890',
  }),
};

export default mockInvoice;
