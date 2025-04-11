export const DtoSchema = (schema: any) => (target: any) => {
  target.prototype.__isDTO = true;
  target.schema = schema;
};
