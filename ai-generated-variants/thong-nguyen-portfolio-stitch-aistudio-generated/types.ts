export interface Project {
  id: string;
  title: string;
  category: string;
  year: string;
  image: string;
  marginTop?: boolean;
}

export interface ExpertiseItem {
  id: string;
  number: string;
  title: string;
  description: string;
  tags: string[];
}