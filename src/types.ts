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
  link: string;
  image: string;
}
