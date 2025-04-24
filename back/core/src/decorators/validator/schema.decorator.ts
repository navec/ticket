// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const DtoSchema = (schema: unknown) => (target: any) => {
	target.prototype.__isDTO = true;
	target.schema = schema;
};
