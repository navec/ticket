import {describe, it, expect} from 'vitest';
import {ZodAdapter} from '../zod.adapter';
import {z} from 'zod';

describe(ZodAdapter.name, () => {
  const adapter = new ZodAdapter();
  const ZodSchema = z.object({
    name: z.string(),
    age: z.number(),
  });

  it('should throw an error for missing required fields', async () => {
    const data = {name: 'John'};
    const validateFn = () => adapter.validate([ZodSchema], [data]);
    await expect(validateFn).rejects.toThrow('age: Required');
  });

  it('should validate the schema correctly', async () => {
    const data = {name: 'John', age: 30};
    const validation = adapter.validate([ZodSchema], [data]);
    await expect(validation).resolves.not.toThrow();
  });
});
