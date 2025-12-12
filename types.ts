export interface SearchParams {
  businessType: string;
  location: string;
  count: number;
}

export interface RouteParams {
  addresses: string[];
}

export interface GroundingChunk {
  web?: {
    uri: string;
    title: string;
  };
  maps?: {
    uri: string;
    title: string;
    placeAnswerSources?: {
      reviewSnippets?: {
        content: string;
      }[];
    }[];
  };
}

export interface GenerationResult {
  text: string;
  groundingChunks: GroundingChunk[];
}

export enum AppStatus {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}

export enum ViewMode {
  HOME = 'HOME',
  PROSPECT = 'PROSPECT',
  ROUTE = 'ROUTE'
}