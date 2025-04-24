import { getMetadata, SCHEMA_PARAM_METADATA, UnknownFunction } from '..';

export class DtoExtractor {
	constructor(
		private readonly options: {
			target: Record<string | symbol, UnknownFunction>;
			method: string;
		}
	) {}

	public extract() {
		const { target, method } = this.options;

		const dtoWithSchemaList =
			getMetadata(SCHEMA_PARAM_METADATA, target, method) || [];

		return dtoWithSchemaList.reduce(
			(
				acc: unknown[],
				current: { index: number; dtodWithSchema: { schema: unknown } }
			) => {
				acc[current.index] = current.dtodWithSchema.schema;
				return acc;
			},
			[]
		);
	}
}
