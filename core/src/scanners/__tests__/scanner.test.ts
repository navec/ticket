import { Scanner } from '@core/scanners';

const mockModuleScanner = jest.fn();
jest.mock('../module.scanner', () => ({
	ModuleScanner: { scan: (...args: unknown[]) => mockModuleScanner(...args) },
}));

describe('Scanner', () => {
	it('should call ModuleScanner.scan with the correct arguments', () => {
		const mockModule = Object.create({ name: 'TestModule' });
		const scanner = new Scanner();

		scanner.scan(mockModule);

		expect(mockModuleScanner).toHaveBeenCalledWith('TestModule', [mockModule]);
	});
});
