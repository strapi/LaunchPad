export interface LogoAnalysis {
  brandName: string;
  description: string;
  visualElements: string[];
  colorPalette: {
    hex: string;
    name: string;
    description: string;
  }[];
  designStyle: string;
  brandPersonality: string;
  potentialIndustries: string[];
  sentiment: string;
}

export interface AnalysisState {
  status: 'idle' | 'loading' | 'success' | 'error';
  data: LogoAnalysis | null;
  error: string | null;
}
