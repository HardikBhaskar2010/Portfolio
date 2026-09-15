import faqsData from './faqs.json';

export interface FAQ {
  q: string;
  a: string;
}

export const faqs: Record<string, FAQ[]> = faqsData as Record<string, FAQ[]>;

