import { describe, expect, it, vi } from 'vitest';
import { Scanner } from '../scanner';
import { ModuleScanner } from '../module.scanner';

vi.mock('../module.scanner', () => ({
	ModuleScanner: { scan: vi.fn() },
}));

describe('Scanner', () => {
	it('should call ModuleScanner.scan with the correct arguments', () => {
		const mockModule = Object.create({ name: 'TestModule' });
		const scanner = new Scanner();

		scanner.scan(mockModule);

		expect(ModuleScanner.scan).toHaveBeenCalledWith('TestModule', [mockModule]);
	});
});
