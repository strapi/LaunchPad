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

    return (
        <div className="w-full py-8 sm:py-12 md:py-16 lg:py-20 px-4 sm:px-6 md:px-12 lg:px-16 xl:px-30">
            {/* Section en colonne */}
            <div className="flex flex-col gap-6 sm:gap-8 md:gap-10 max-w-7xl mx-auto">

                {/* Heading */}
                {heading && (
                    <Typography
                        variant="h2"
                        className="font-bold text-center sm:text-left"
                    >
                        {heading}
                    </Typography>
                )}

                {/* Sub heading */}
                {sub_heading && (
                    <Typography
                        variant="h4"
                        className="font-extralight max-w-3xl text-center sm:text-left"
                    >
                        {sub_heading}
                    </Typography>
                )}

                {/* Cards */}
                {team_members && team_members.length > 0 && (
                    <div
                        className="
                            w-full
                            flex
                            flex-col
                            sm:flex-row
                            flex-wrap
                            gap-6
                            sm:gap-8
                            md:flex-nowrap
                            md:gap-10
                            justify-center
                            sm:justify-start
                        "
                    >
                        {team_members.map((member, index) => (
                            <TeamMemberCard
                                key={member.slug || index}
                                member={member}
                                locale={locale}
                            />
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
