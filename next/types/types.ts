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


export interface Projet  {
  heading: string;
  sub_heading: string;
  description: any;
  documentId: string;
  image?: Image;
  slug: string;
};
export interface TeamMember  {
  heading: string;
  sub_heading: string;
  description: any;
  documentId: string;
  image?: Image;
  slug: string;
};


export interface Technologie {
  name: string ;
  description: string ;
  documentId: string;
}


export interface SectionTitleContentImage {
 heading: string;
 sub_heading:string;
 content: any;
 image?: Image;
}

export interface SectionImage {
  image?: Image;
}