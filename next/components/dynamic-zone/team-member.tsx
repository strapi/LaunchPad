import Image from 'next/image';

import { Typography } from '../ui/typography';
import { strapiImage } from '@/lib/strapi/strapiImage';

export interface ThemeMemberProps {
  heading: string;
  team_members: TeamMember[];
}

export interface TeamMember {
  id: number;
  documentId: string;
  slug: null | string;
  first_name: string;
  last_name: string;
  image: Image;
  social_link: SocialLink[] | null;
}

export interface Image {
  url: string;
}

export interface SocialLink {
  id: number;
  social_link_items: SocialLinkItem[];
}

export interface SocialLinkItem {
  logo_name: string;
  url: string;
  logo_social: Image;
}

export function ThemeMember({ heading, team_members }: ThemeMemberProps) {
  return (
    <div className="flex flex-col space-y-4 px-10 md:px-24">
      <Typography as="h2" className="text-primary text-start">
        {heading}
      </Typography>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {team_members.map((el, index) => (
          <div key={index} className="flex flex-col space-y-4 p-4 shadow">
            <Image
              src={`${strapiImage(el.image?.url)}`}
              alt="Membre de webtinix"
              height={300}
              width={300}
              className="object-center object-contain rounded-lg"
            />
            <Typography as="h3" className="font-semibold">
              <span className="uppercase">{el.last_name}</span>{' '}
              {el.first_name}{' '}
            </Typography>
            <Typography as="p"></Typography>
            <div className="flex space-x-2">
              {team_members.map((el, index) => (
                <div key={index}></div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
