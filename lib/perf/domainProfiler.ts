import { logger } from "@/lib/logging/logger";

const now = () => (typeof performance !== "undefined" && performance.now ? performance.now() : Date.now());

type DomainResult<T> = {
  value: T;
  inputSize?: number;
  outputSize?: number;
};

export async function profileDomain<T>(
  name: string,
  requestId: string | undefined,
  fn: () => Promise<DomainResult<T>> | DomainResult<T>,
): Promise<T> {
  const start = now();
  try {
    const payload = await fn();
    const durationMs = now() - start;
    logger.info({
      msg: "domain.profile",
      name,
      durationMs,
      inputSize: payload.inputSize,
      outputSize: payload.outputSize,
      requestId,
    });
    return payload.value;
  } catch (err) {
    const durationMs = now() - start;
    logger.error({ msg: "domain.profile.error", name, durationMs, requestId, err });
    throw err;
  }
}
