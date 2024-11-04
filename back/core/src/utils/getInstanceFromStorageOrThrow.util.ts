import {GLOBAL_INSTANCES_STORAGE} from '../decorators/constants';

export const getInstanceFromStorageOrThrow = <T>(target: any): T => {
  if (!GLOBAL_INSTANCES_STORAGE[target.name]) {
    // Code: 500
    throw new Error(`Dependency ${target.name} not found.`);
  }
  return GLOBAL_INSTANCES_STORAGE[target.name];
};
