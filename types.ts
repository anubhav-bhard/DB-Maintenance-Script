
export interface TableItem {
  id: string;
  name: string;
  schema?: string;
  rawName: string;
}

export interface GeneratedScripts {
  vacuum: string;
  reindex: string;
  combined: string;
}

export interface AIAdvice {
  summary: string;
  recommendations: string[];
  riskAssessment: string;
}
