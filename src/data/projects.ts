import generated from './projects.generated.json';

export interface Project {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  category: string;
  tag: string;
  year: string;
  image: string;
  heroImage: string;
  description: string;
  longDescription: string;
  featured: boolean;
  tools: string[];
  link?: string;
  color: string;
}

export const projects: Project[] = generated as Project[];
export const featuredProjects = projects.filter(p => p.featured);
