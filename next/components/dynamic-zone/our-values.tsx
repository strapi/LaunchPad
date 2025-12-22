"use client";

import React, { useRef, useState } from 'react';
import { Typography } from "../ui/typography";
import Image from 'next/image';
import { strapiImage } from '@/lib/strapi/strapiImage';

export interface OurValuesProps {
    heading: string;
    values_items: ValuesItem[];
}

export interface ValuesItem {
    heading: string;
    sub_heading: string;
    logo: Logo;
}

export interface Logo {
    alternativeText: string | null;
    url: string;
}

export function OurValues({ heading, values_items }: OurValuesProps) {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [scrollProgress, setScrollProgress] = useState(0);

    // Calcul de la position du curseur noir en fonction du scroll
    const handleScroll = () => {
        if (scrollContainerRef.current) {
            const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
            const scrollPercent = (scrollTop / (scrollHeight - clientHeight)) * 100;
            setScrollProgress(scrollPercent);
        }
    };

    return (
        <section className="w-full px-6 md:px-12 lg:px-20 py-16 md:py-24 bg-white">
            <Typography className="text-primary font-bold text-3xl md:text-4xl mb-12 lg:mb-16 uppercase tracking-tight">
                {heading}
            </Typography>

            <div className="flex gap-6 md:gap-12 relative h-[700px]">

                {/* --- LA BARRE DE SCROLL À GAUCHE --- */}
                <div className="relative w-1 h-full flex flex-col items-center">
                    <div className="absolute inset-0 w-[1px] bg-gray-200 left-1/2 -translate-x-1/2"></div>

                    <div
                        className="absolute w-[6px] h-12 bg-black rounded-full transition-all duration-75 ease-out"
                        style={{
                            top: `${scrollProgress}%`,
                            transform: `translateY(-${scrollProgress}%) translateX(-50%)`,
                            left: '50%'
                        }}
                    ></div>
                </div>

                {/* --- CONTENEUR DES CARTES (Scrollbar masquée) --- */}
                <div
                    ref={scrollContainerRef}
                    onScroll={handleScroll}
                    className="flex-1 flex flex-col gap-6 overflow-y-auto no-scrollbar scroll-smooth"
                    style={{
                        scrollbarWidth: 'none', // Firefox
                        msOverflowStyle: 'none' // IE/Edge
                    }}
                >
                    {values_items.map((item, index) => (
                        <div
                            key={index}
                            className="bg-[#f2f2f2] rounded-2xl p-8 md:p-10 flex flex-col md:flex-row gap-8 items-start shrink-0 min-h-[220px]"
                        >
                            <div className="w-16 h-16 md:w-20 md:h-20 shrink-0 rounded-full flex items-center justify-center">
                                <Image
                                    src={strapiImage(item.logo.url)}
                                    alt={item.logo.alternativeText || 'Value icon'}
                                    width={35}
                                    height={35}
                                    className='w-full h-full rounded-full'
                                />
                            </div>

                            <div className="flex-1">
                                <Typography as="h3">
                                    {item.heading}
                                </Typography>

                                <div className="h-[1px] bg-gray-400 w-full max-w-[200px] mt-3 mb-6"></div>

                                <Typography as="p" className="leading-relaxed max-w-2xl">
                                    {item.sub_heading}
                                </Typography>
                            </div>
                        </div>
                    ))}
                    <div className="h-4 shrink-0"></div>
                </div>
            </div>

            {/* CSS pour masquer la scrollbar sur Chrome/Safari */}
            <style jsx>{`
                .no-scrollbar::-webkit-scrollbar {
                    display: none;
                }
            `}</style>
        </section>
    );
}