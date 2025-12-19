import React from 'react';
import { Typography } from '@/components/ui/typography';
import { BlurImage } from '@/components/blur-image';
import { strapiImage } from '@/lib/strapi/strapiImage';
import type { SectionTeamMembersAPropos, TeamMember } from '@/types/types';
import Link from 'next/link';

interface TeamMembersAProposProps extends SectionTeamMembersAPropos {
    locale?: string;
}

export function TeamMembersAPropos({
    locale,
    heading,
    sub_heading,
    team_members
}: TeamMembersAProposProps) {

    console.log({ team_members });

    return (
        <div className="w-full py-8 sm:py-12 md:py-16 lg:py-20 px-4 sm:px-6 md:px-12 lg:px-16 xl:px-30">
            {/* Section en colonne */}
            <div className="flex flex-col gap-8 sm:gap-10  max-w-7xl">

                {/* Heading */}
                {heading && (
                    <Typography variant="h2" className="font-bold">
                        {heading}
                    </Typography>
                )}

                {/* Sub heading */}
                {sub_heading && (
                    <Typography
                        variant="h4"
                        className="font-extralight max-w-3xl"
                    >
                        {sub_heading}
                    </Typography>
                )}

                {/* Cards */}
                {team_members && team_members.length > 0 && (
                    <div className="w-full flex flex-wrap gap-6 sm:gap-8 md:gap-10">
                        {team_members.map((member, index) => (
                            <TeamMemberCard key={member.slug || index} member={member} locale={locale} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

/* -------------------------------------------------------------------------- */
/*                                   CARD                                     */
/* -------------------------------------------------------------------------- */

interface TeamMemberCardProps {
    member: TeamMember;
    locale?: string;
}

function TeamMemberCard({ member, locale }: TeamMemberCardProps) {
    const { first_name, last_name, poste, image, links } = member;

    return (
        <div className="flex flex-col bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden w-full sm:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.5rem)] max-w-[420px]">

            {/* Image avec padding intérieur */}
            {image && (
                <div className="p-4 sm:p-5">
                    <div className="relative w-full aspect-[427/430] rounded-lg overflow-hidden p-2">
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
            <div className="flex flex-col gap-1 px-5 pb-5">

                {/* Nom */}
                {(first_name || last_name) && (
                    <Typography variant="base" className="font-semibold">
                        {last_name}  {first_name}
                    </Typography>
                )}

                {/* Poste */}
                {poste && (
                    <div className="flex flex-col gap-1">
                        {poste.heading && (
                            <Typography variant="small" className="font-medium">
                                {poste.heading}
                            </Typography>
                        )}

                        {/* {poste.sub_heading && (
                            <Typography
                                variant="small"
                                className="font-extralight text-muted-foreground"
                            >
                                {poste.sub_heading}
                            </Typography>
                        )} */}
                    </div>
                )}

                {/* Social links */}
                <div className="flex  gap-2 pt-2">
                    {links.map((item) => (
                        <Link
                            target={item.target}
                            href={`${item.URL.startsWith('http') ? '' : `/${locale}`}${item.URL}`}
                            key={item.id}
                        >
                            {item.icon?.image?.url ? (
                                <BlurImage
                                    src={strapiImage(item.icon.image.url)}
                                    alt={item.icon.image.alternativeText || ''}
                                    width={18}
                                    height={18}
                                    className=""
                                />
                            ) :
                                <>{item.text}</>
                            }
                        </Link>
                    ))}
                </div>

            </div>
        </div>
    );
}
