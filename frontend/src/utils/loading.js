export const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export async function withMinimumDelay(operation, minMs = 900) {
  const start = Date.now();
  const result = await operation();
  const elapsed = Date.now() - start;

  if (elapsed < minMs) {
    await delay(minMs - elapsed);
  }

  return result;
}
