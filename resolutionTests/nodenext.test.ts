import { beforeEach, expect, test } from 'bun:test';
import { mock, clearMocks } from '../src/index.js';

beforeEach(() => {
  clearMocks();
});

test('nodenext: should import mock', () => {
  expect(mock).toBeDefined();
});

test('nodenext: should mock a response correctly', async () => {
  mock("https://example.com/api/data", {
    method: 'POST',
    response: { data: { foo: "bar" }, status: 200 }
  });

  const result = await fetch('https://example.com/api/data', { method: 'POST' });
  const resultBody = await result.json();
  expect(resultBody).toStrictEqual({ foo: "bar" })
});