// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getMetadata = <T = any>(
  metadataKey: string,
  target: Object,
  propertyKey?: string | symbol,
): T => {
  if (propertyKey) {
    return Reflect.getMetadata(metadataKey, target, propertyKey);
  }
  return Reflect.getMetadata(metadataKey, target);
};
