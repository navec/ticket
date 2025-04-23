import {describe, it, expect, vi} from 'vitest';
import {PATH_METADATA, Get, Post, Put, Delete, Patch} from 'core/src';

describe('createHttpRequest', () => {
  it.each([
    {fn: Get, name: 'Get'},
    {fn: Post, name: 'Post'},
    {fn: Put, name: 'Put'},
    {fn: Patch, name: 'Patch'},
    {fn: Delete, name: 'Delete'},
  ])('should define metadata for the $name HTTP method and path', ({fn}) => {
    const mockDescriptor = {value: vi.fn()};
    const path = '/test-path';

    const result = fn(path)({}, '', mockDescriptor);

    expect(result).toBe(mockDescriptor);
    expect(Reflect.getMetadata(PATH_METADATA, mockDescriptor.value)).toBe(path);
  });

  it('should use default path if none is provided', () => {
    const mockDescriptor = {value: vi.fn()};

    const result = Post()({}, '', mockDescriptor);

    expect(result).toBe(mockDescriptor);
    expect(Reflect.getMetadata(PATH_METADATA, mockDescriptor.value)).toBe('/');
  });

  it('should not modify the original method', () => {
    const originalMethod = vi.fn();
    const mockDescriptor = {value: originalMethod};

    const result = Put('/another-path')({}, '', mockDescriptor);

    expect(result.value).toBe(originalMethod);
  });
});
