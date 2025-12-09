'use client';

import React from 'react';

import { Image, Technologie } from '@/types/types';

interface TechnologyCard {
  heading: string;
  image: Image;
  technologies: Technologie[];
}

type TechnologiesHomeProps = {
  heading: string;
  sub_heading: string;
  cards: TechnologyCard[];
  locale: string;
};

export function TechnologiesHome(props : TechnologiesHomeProps) {
    
  return <div>technologies-home</div>;
}
