import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { logger } from "@/lib/logging/logger";
import { getRequestId } from "@/lib/observability/request";
import { profileApi } from "@/lib/perf/apiProfiler";

export async function POST(req: Request) {
  const requestId = getRequestId(req);
  return profileApi("users.create", requestId, async () => {
    try {
      const body = await req.json();
      const { email, name } = body;

      const user = await prisma.user.create({
        data: {
          email,
          name,
        },
      });

      return NextResponse.json({ success: true, user });
    } catch (error) {
      console.error("Error creating user:", error);
      logger.error({ msg: "user.create.error", err: error, requestId });
      return NextResponse.json(
        { success: false, error: "Failed to create user" },
        { status: 500 }
      );
    }
  });
}
