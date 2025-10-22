
export interface KeyFact {
  fact: string;
  witness: string;
  pageLine: string;
  summary: string;
}

export interface Exhibit {
  id: string;
  description: string;
  pageLine: string;
}

export interface Objection {
  type: string;
  by: string;
  ruling: 'Sustained' | 'Overruled' | 'Not Stated';
  pageLine: string;
}

export interface AnalysisResult {
  keyFactsAndAdmissions: KeyFact[];
  exhibitsReferenced: Exhibit[];
  objectionsLog: Objection[];
}
