export interface LinkAnalysis {
  summary: string;
  isSafe: boolean;
  category: string;
  title: string;
}

export interface AnalysisState {
  loading: boolean;
  data: LinkAnalysis | null;
  error: string | null;
}
