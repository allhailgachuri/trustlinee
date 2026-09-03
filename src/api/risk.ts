import type { RiskAssessment, RiskAssessmentInput } from "@/lib/types";
import { scoreApplicant, type ScoredResult } from "@/lib/risk-engine";
import { assessments, auditEvents } from "@/data/dataset";
import { sleep } from "./client";

export const riskApi = {
  async assessRisk(input: RiskAssessmentInput, borrowerId?: string): Promise<ScoredResult> {
    await sleep(300); // Simulate model inference latency

    const result = scoreApplicant(input);

    if (borrowerId) {
      const newAssessment: RiskAssessment = {
        id: `ASM-${Date.now().toString().slice(-6)}`,
        borrowerId,
        createdAt: new Date().toISOString(),
        probabilityOfDefault: result.probabilityOfDefault,
        riskScore: result.riskScore,
        riskBand: result.riskBand,
        recommendation: result.recommendation,
        modelVersion: "xgb-1.4.0 (Primary)",
        contributions: result.contributions,
        confidence: result.confidence,
      };

      if (!assessments[borrowerId]) {
        assessments[borrowerId] = [];
      }
      assessments[borrowerId].unshift(newAssessment);
    }

    auditEvents.unshift({
      id: `EVT-${Date.now()}`,
      timestamp: new Date().toISOString(),
      user: "Dr. Sarah Kimani",
      action: "Risk assessment calculated",
      entity: "Assessment",
      entityId: borrowerId || "SIMULATION",
      result: "success",
    });

    return result;
  },

  async getBorrowerAssessments(borrowerId: string): Promise<RiskAssessment[]> {
    await sleep(150);
    return assessments[borrowerId] || [];
  },
};
