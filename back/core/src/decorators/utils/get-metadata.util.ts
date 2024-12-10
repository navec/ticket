export const getMetadata = (
  metadataKey: any,
  target: Object,
  propertyKey?: string | symbol
) => {
  if (propertyKey) {
    return Reflect.getMetadata(metadataKey, target, propertyKey);
  }
  return Reflect.getMetadata(metadataKey, target);
};
