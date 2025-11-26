export type PreviewData = {
  success: boolean;
  card: {
    id: string;
    userId: string;
    bank: string;
    limit: number;
    closingDay: number;
    dueDay: number;
    createdAt: string;
  };
  newMonthlyTotal: number;
  newMonthlyDelta: number;
  newUtilization: number;
  newRisk: "green" | "yellow" | "red";
  freedomDate: string | null;
  freedomDateWithExtra: string | null;
  recommendedPayment: number;
  interestSavings: number;
  mesPrimeraCuota: number;
  firstDueDate: string | null;
  lastDueDate: string | null;
  nextDueDate: string | null;
  timeline: { month: string; total: number; dueDates: string[] }[];
  daysToNextPeriod: number;
};
