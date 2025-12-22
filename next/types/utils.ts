export interface StrapiMedia {
  id: number;
  documentId: string;
  name: string;
  alternativeText: string | null;
  caption: string | null;
  width: number;
  height: number;
  formats: StrapiMediaFormats | null;
  hash: string;
  ext: string;
  mime: string;
  size: number;
  url: string;
  previewUrl: string | null;
  provider: string;
  provider_metadata: any | null;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

export interface StrapiMediaFormats {
  thumbnail?: StrapiMediaFormat;
  small?: StrapiMediaFormat;
  medium?: StrapiMediaFormat;
  large?: StrapiMediaFormat;
}

export interface StrapiMediaFormat {
  ext: string;
  url: string;
  hash: string;
  mime: string;
  name: string;
  path: string | null;
  size: number;
  width: number;
  height: number;
}

export interface Icon {
  id: number;
  documentId: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  image: StrapiMedia;
}


export interface LinkItem {
  id: number;
  text: string | null;
  URL: string;
  target: string;
  icon: Icon;
}

export interface Button {
  id: number;
  text: string;
  URL: string;
  target: null;
  variant: string;
}