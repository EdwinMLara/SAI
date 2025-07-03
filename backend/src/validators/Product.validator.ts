import { z } from 'zod';

const Prices = z.object({
  distribution: z
    .number()
    .min(0, 'El precio de distribución debe ser no negativo'),
  wholesale: z.number().min(0, 'El precio mayorista debe ser no negativo'),
  mid_wholesale: z
    .number()
    .min(0, 'El precio medio mayorista debe ser no negativo'),
  retail: z.number().min(0, 'El precio minorista debe ser no negativo'),
});

const ProductValidator = z.object({
  key: z.string().min(1, 'La clave es obligatoria'),
  description: z.string().min(1, 'La descripción es obligatoria'),
  prices: Prices,
});

export type ProductType = z.infer<typeof ProductValidator>;
export default ProductValidator;
