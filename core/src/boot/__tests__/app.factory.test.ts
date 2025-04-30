import 'reflect-metadata';
import { ServerAdapter } from '@core/adapters';
import { AppBootFactory, SERVER_TYPE_ADAPTER_REGISTRY } from '@core/boot';
import { ServerType } from '@core/enums';

const mockAppBuilderBuild = jest.fn();
const mockSetModule = jest.fn();
const mockSetServer = jest.fn();
jest.mock('@core/boot/app.builder', () => ({
	AppBuilder: class {
		build = (...args: unknown[]) => mockAppBuilderBuild(...args);
		setModule = mockSetModule.mockImplementation(() => this);
		setServer = mockSetServer.mockImplementation(() => this);
	},
}));

describe('AppFactory', () => {
	afterEach(mockAppBuilderBuild.mockClear);

	describe('getServer', () => {
		it('should return the correct ServerAdapter for a valid server type', () => {
			const mockAdapter = jest.fn();
			SERVER_TYPE_ADAPTER_REGISTRY[ServerType.HTTP_SERVER] = mockAdapter;

			const server = AppBootFactory.getServer(ServerType.HTTP_SERVER);

			expect(server).toBeInstanceOf(mockAdapter);
		});

		it('should throw an error for an unsupported server type', () => {
			expect(() =>
				AppBootFactory.getServer('INVALID_TYPE' as ServerType)
			).toThrow('Unsupported or unimplemented server type: INVALID_TYPE');
		});
	});

	describe('create', () => {
		const mockModule = class {};
		const mockApp = 'mockApp' as unknown as ServerAdapter;

		beforeAll(() => {
			mockAppBuilderBuild.mockResolvedValue(mockApp);
			SERVER_TYPE_ADAPTER_REGISTRY[ServerType.HTTP_SERVER] = jest.fn();
		});

		it('should create an AppBuilder instance with the correct module and server', async () => {
			const app = await AppBootFactory.create(mockModule, {
				type: ServerType.HTTP_SERVER,
			});

			expect(mockAppBuilderBuild).toHaveBeenCalled();
			expect(app).toBe('mockApp');
		});

		it('should use the default server type if none is provided', async () => {
			const app = await AppBootFactory.create(mockModule);

			expect(mockAppBuilderBuild).toHaveBeenCalled();
			expect(app).toBe('mockApp');
		});
	});
});
