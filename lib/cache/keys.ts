export function scheduleKey(userId: string, cardId: string) {
  return `kredia:v1:schedule:${userId}:${cardId}`;
}

export function projectionKey(userId: string) {
  return `kredia:v1:projection:${userId}`;
}

export function riskKey(userId: string) {
  return `kredia:v1:risk:${userId}`;
}

export function dashboardOverviewKey(userId: string) {
  return `kredia:v1:dashboard:${userId}`;
}
