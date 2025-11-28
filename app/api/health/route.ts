import { NextResponse } from "next/server";
import { prisma } from "@/lib/server/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type HealthStatus = "healthy" | "degraded" | "unhealthy";

type HealthCheck = {
  status: HealthStatus;
  timestamp: string;
  checks: {
    database: {
      status: "up" | "down";
      latency?: number;
      error?: string;
    };
    prisma: {
      status: "up" | "down";
      error?: string;
    };
  };
  uptime: number;
};

const startTime = Date.now();

export async function GET() {
  const result: HealthCheck = {
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: Math.floor((Date.now() - startTime) / 1000),
    checks: {
      database: { status: "down" },
      prisma: { status: "down" },
    },
  };

  // Check 1: Prisma connection y database
  try {
    const start = Date.now();
    await prisma.$queryRaw`SELECT 1 as health`;
    const latency = Date.now() - start;

    result.checks.database = { status: "up", latency };
    result.checks.prisma = { status: "up" };
  } catch (error) {
    result.status = "unhealthy";
    const errorMessage = error instanceof Error ? error.message : String(error);
    result.checks.database.error = errorMessage;
    result.checks.prisma.error = "Connection failed";
  }

  // Determinar status HTTP
  const httpStatus = result.status === "unhealthy" ? 503 : 200;

  return NextResponse.json(result, { status: httpStatus });
}
