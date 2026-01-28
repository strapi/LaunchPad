import Image from 'next/image';

import { Typography } from '../ui/typography';
import { strapiImage } from '@/lib/strapi/strapiImage';
import { TeamMember } from '@/types/types';
import Link from 'next/link';
import { BlurImage } from '@/components/blur-image';


interface ThemeMemberProps {
  heading: string;
  locale?: string;
  team_members: TeamMember[];
}

export function ThemeMember({ heading, team_members,locale }: ThemeMemberProps) {
  return (
    <div className="flex flex-col space-y-4 px-10 md:px-24">
      <Typography as="h2" className="text-primary text-start font-bold md:mt-14">
        {heading}
      </Typography>
       {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"> */}
      <div className="flex flex-col sm:flex-row sm:flex-wrap sm:justify-start gap-6 md:gap-8">
        {team_members.map((el, index) => (
          <TeamMemberCard 
            key={index} 
            member={el}
            locale={locale} />
        
        ))}
      </div>
    </div>
  );
}


interface TeamMemberCardProps {
    member: TeamMember;
    locale?: string;
}

function TeamMemberCard({ member, locale }: TeamMemberCardProps) {
    const { first_name, last_name, poste, image, links } = member;

    return (
        <div
            className="
                flex
                flex-col
                bg-white
                shadow-md
                hover:shadow-lg
                transition-all
                duration-300
                overflow-hidden
                w-full
                sm:w-[calc(50%-1rem)]
                lg:w-[calc(33.333%-1.5rem)]
                max-w-[420px]
                mx-auto
                sm:mx-0
            "
        >
            {/* Image */}
            {image && (
                <div className="p-4 sm:p-5">
                    <div className="relative w-full aspect-square sm:aspect-[427/430] rounded-lg overflow-hidden">
                        <BlurImage
                            src={strapiImage(image.url)}
                            alt={image.alternativeText || `${first_name} ${last_name}`}
                            fill
                            className="object-cover object-[40%_10%] rounded-lg"
                            sizes="(max-width: 640px) 100vw, 380px"
                        />
                    </div>
                </div>
            )}

            {/* Texte */}
            <div className="flex flex-col gap-2 px-5 pb-6 text-center sm:text-left">

                {/* Nom */}
                {(first_name || last_name) && (
                    <Typography variant="base" className="font-semibold">
                        {last_name} {first_name}
                    </Typography>
                )}

                {/* Poste */}
                {poste && poste.heading && (
                    <Typography variant="small" className="font-medium">
                        {poste.heading}
                    </Typography>
                )}

                {/* Social links */}
                {links && links.length > 0 && (
                    <div className="flex justify-center sm:justify-start gap-3 pt-3">
                        {links.map((item) => (
                            <Link
                                key={item.id}
                                target={item.target}
                                href={`${item.URL.startsWith('http') ? '' : `/${locale}`}${item.URL}`}
                            >
                                {item.icon?.image?.url ? (
                                    <BlurImage
                                        src={strapiImage(item.icon.image.url)}
                                        alt={item.icon.image.alternativeText || ''}
                                        width={18}
                                        height={18}
                                    />
                                ) : (
                                    <>{item.text}</>
                                )}
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}