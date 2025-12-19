import { Heading } from '@/components/elements/heading';
import { Subheading } from '@/components/elements/subheading';
import { LinkItem } from './utils';
export interface Category {
  name: string;
}

export interface Image {
  url: string;
  alternativeText: string;
}

export interface Article {
  title: string;
  description: string;
  slug: string;
  content: string;
  dynamic_zone: any[];
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  locale: string;
  image: Image;
  categories: Category[];
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: number;
  plans: any[];
  perks: any[];
  dynamic_zone: any[];
  featured?: boolean;
  images: any[];
  categories?: any[];
}


export interface Projet {
  heading: string;
  sub_heading: string;
  description: any;
  documentId: string;
  image?: Image;
  slug: string;
};
export interface TeamMember {
  first_name: string;
  last_name: string;
  poste: Poste;
  description: any;
  image?: Image;
  slug: string;
  links: LinkItem[];
};


export interface Technologie {
  name: string;
  description: string;
  documentId: string;
}

export interface Poste {
  heading: string;
  sub_heading: string; 
}
export interface Logo {
  documentId: string;
  company: string;
  image?: Image;
}


export interface SectionTitleContentImage {
  heading: string;
  sub_heading: string;
  content: any;
  image?: Image;
}

export interface SectionImage {
  image?: Image;
}

export interface ButtonComponent {
  text: string;
  url: string;
  target: any;
  variant: any;
}


export interface SectionAproposDeNous {
  heading: string;
  sub_heading: string;
  description: any;
  title: string;
  image?: Image;
  cta: ButtonComponent;
  cards: {
    icon: Image;
    title: string;
    description: string;
  }[]
}


export interface SectionNosValeursAPropos {
  heading: string;
  sub_heading: string;
  cta: ButtonComponent;
  a_propos_nos_valeurs: {
    icon: Image;
    heading: string;
    sub_heading: string;
  }[]
}


export interface SectionTeamMembersAPropos {
  heading: string;
  sub_heading: string;
  team_members: TeamMember[];
}
