export interface Project {
  id: string;
  title: string;
  category: string;
  year: string;
  image: string;
  marginTop: boolean;
  link?: string;
}

export interface ExpertiseItem {
  id: string;
  number: string;
  title: string;
  description: string;
  tags: string[];
  link?: string;
}

export interface PortfolioItem {
  title: string;
  description: string;
  technologies: string[];
  roles: string[];
  year: string;
  type: PortfolioType;
  link?: string;
  image: string;
}

export enum PortfolioType {
  DESIGN = 'design',
  WEB = 'web',
  API = 'api',
}
