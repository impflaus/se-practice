export type Decision = "available" | "unavailable";

export interface CheckResult {
  decision: Decision;
  reasons: string[];
}