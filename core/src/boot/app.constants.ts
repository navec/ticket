import { ServerType, ValidatorType } from '@core/enums';
import { HttpServerAdapter, ZodAdapter } from '@core/adapters';

export const SERVER_TYPE_ADAPTER_REGISTRY = {
	[ServerType.HTTP_SERVER]: HttpServerAdapter,
	[ServerType.EXPRESS]: null,
	// [ServerType.FASTIFY]: FastifyAdapter,
	// [ServerType.NEST]: NestAdapter,
	// [ServerType.KOA]: KoaAdapter,
	// [ServerType.HAPI]: HapiAdapter,
	// [ServerType.SOCKET_IO]: SocketIoAdapter,
	// [ServerType.WEB_SOCKET]: WebSocketAdapter,
	// [ServerType.GRAPHQL]: GraphqlAdapter,
	// [ServerType.REST]: RestAdapter,
	// [ServerType.RPC]: RpcAdapter,
	// [ServerType.MQTT]: MqttAdapter,
	// [ServerType.REDIS]: RedisAdapter,
	// [ServerType.AMQP]: AmqpAdapter,
	// [ServerType.KAFKA]: KafkaAdapter,
	// [ServerType.PULSAR]: PulsarAdapter,
};

export const VALIDATOR_TYPE_ADAPTER_REGISTRY = {
	[ValidatorType.ZOD]: ZodAdapter,
	// [ValidatorType.JOI]: JoiAdapter,
	// [ValidatorType.VALIDATOR_JS]: ValidatorJsAdapter,
	// [ValidatorType.VALIDATOR_TS]: ValidatorTsAdapter,
	// [ValidatorType.VALIDATOR_YUP]: ValidatorYupAdapter,
};
