import { Result } from './Result.js';

export async function safeAsync(fn) {
  try {
    const result = await fn();
    return Result.ok(result);
  } catch (err) {
    return Result.fail(err);
  }
}
