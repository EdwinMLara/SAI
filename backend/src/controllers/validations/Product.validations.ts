import ProductModel from '../../models/Product.model';

export async function exists(key: string): Promise<{
  pass: boolean;
  error?: boolean;
}> {
  try {
    const result = await ProductModel.findOne({ key });
    return { pass: !!result };
  } catch {
    return {
      pass: false,
      error: true,
    };
  }
}
