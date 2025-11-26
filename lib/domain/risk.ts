import { redisCache } from "@/lib/cache/cache";
import { riskKey } from "@/lib/cache/keys";
import { profileDomain } from "@/lib/perf/domainProfiler";

type RiskInput = {
  userId: string;
  utilization: number;
};

export async function calculateRisk(input: RiskInput, ctx?: { requestId?: string }) {
  const key = riskKey(input.userId);
  const compute = async () => {
    let risk: "green" | "yellow" | "red" = "green";
    if (input.utilization >= 70) risk = "red";
    else if (input.utilization >= 30) risk = "yellow";
    return { risk, utilization: input.utilization };
  };
  const profiledCompute = async () =>
    profileDomain("domain.risk", ctx?.requestId, async () => {
      const result = await compute();
      return { value: result, inputSize: 1, outputSize: 1 };
    });
  return redisCache(key, profiledCompute, 300, { requestId: ctx?.requestId });
}
