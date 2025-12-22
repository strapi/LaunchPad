import React from 'react';
import { Typography } from '@/components/ui/typography';
import { BlurImage } from '@/components/blur-image';
import { strapiImage } from '@/lib/strapi/strapiImage';
import type { SectionNosValeursAPropos } from '@/types/types';

interface NosValeursAProposProps extends SectionNosValeursAPropos {
    locale?: string;
}

export function NosValeursAPropros({
    heading,
    sub_heading,
    a_propos_nos_valeurs,
    locale
}: NosValeursAProposProps) {
    return (
        <div className="bg-tertiare w-full py-8 sm:py-12 md:py-16 lg:py-20 px-4 sm:px-6 md:px-12 lg:px-16 xl:px-30">
            {/* Section principale en colonne */}
            <div className=" flex flex-col gap-6 sm:gap-8 md:gap-10 items-center text-center max-w-7xl mx-auto">

                {/* Heading */}
                {heading && (
                    <Typography
                        variant="h2"
                        className="font-bold max-w-4xl"
                    >
                        {heading}
                    </Typography>
                )}

                {/* Sub Heading */}
                {sub_heading && (
                    <Typography
                        variant="h4"
                        className="font-extralight  px-4 sm:px-8 "
                    >
                        {sub_heading}
                    </Typography>
                )}

                {/* Cards en flex */}
                {a_propos_nos_valeurs && a_propos_nos_valeurs.length > 0 && (
                    <div className="w-full flex flex-wrap gap-6 sm:gap-8 md:gap-10 mt-10 md:mt-8 lg:mt-8">
                        {a_propos_nos_valeurs.map((card, index) => (
                            <div
                                key={index}
                                className="  flex flex-col items-center
                                            gap-4 sm:gap-5
                                            bg-white
                                            p-6 sm:p-8
                                            rounded-xl
                                            shadow-md
                                            transition-all
                                            w-full
                                            sm:w-[calc(50%-1rem)]
                                            md:w-[calc(33.333%-1rem)]
                                            lg:w-[calc(25%-1rem)]
                                            max-w-[280px]
                                            aspect-[381/476]"
                            >
                                {/* Icon */}
                                {card.icon && (
                                    <div className="bg-tertiare relative w-20 h-20 sm:w-24 sm:h-24 md:w-20 md:h-20 rounded-full overflow-hidden">
                                        <BlurImage
                                            src={strapiImage(card.icon.url)}
                                            alt={card.icon.alternativeText || card.heading}
                                            fill
                                            className="object-contain p-4 sm:p-5 md:p-4"
                                            sizes="80px"
                                        />
                                    </div>
                                )}

                                {/* Card Heading */}
                                {card.heading && (
                                    <Typography
                                        variant="h3"
                                        className="font-semibold text-center"
                                    >
                                        {card.heading}
                                    </Typography>
                                )}

                                {/* Card Sub Heading */}
                                {card.sub_heading && (
                                    <Typography
                                        variant="base"
                                        className="font-extralight text-center leading-relaxed"
                                    >
                                        {card.sub_heading}
                                    </Typography>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}