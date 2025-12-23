"use client";

import Image from "next/image";
import {
    Carousel,
    CarouselContent,
    CarouselIndicator,
    CarouselItem
} from "@/components/ui/carousel";
import { strapiImage } from "@/lib/strapi/strapiImage";
import { Typography } from "../ui/typography";
import { BlocksRenderer } from "@strapi/blocks-react-renderer";

export interface CarouselAvisClientProps {
    avis_clients: AvisClient[];
}

interface AvisClient {
    client_name: string;
    pseudo_client: string;
    description: Description[];
    entreprise_name: string;
    client_photo: ClientPhoto;
    option_projet: OptionProjet[];
}

export interface ClientPhoto {
    alternativeText: null;
    url: string;
}

export interface Description {
    type: string;
    children: Child[];
}

export interface Child {
    type: string;
    text: string;
    bold?: boolean;
}

export interface OptionProjet {
    id: number;
    options: string;
}

export function CarouselAvisClient({ avis_clients }: CarouselAvisClientProps) {
    return (
        <section className="w-full py-20">
            <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24 py-24">
                <Carousel
                    opts={{
                        align: "start",
                        loop: true,
                    }}
                    className="w-full p-8"
                >
                    <CarouselContent>
                        {avis_clients.map((el, index) => (
                            <CarouselItem key={index}>
                                <div className=" p-8 md:p-12 flex flex-col md:flex-row gap-10 md:gap-16 items-center shadow-sm">

                                    {/* --- IMAGE CLIENT --- */}
                                    <div className="relative w-full max-w-[320px] aspect-square shrink-0 overflow-hidden rounded-sm">
                                        <Image
                                            src={strapiImage(el.client_photo?.url)}
                                            alt={el.client_name}
                                            fill
                                            className="object-cover object-center"
                                        />
                                    </div>

                                    {/* --- CONTENU --- */}
                                    <div className="flex flex-col flex-1 space-y-6">
                                        {/* Icône Guillemet */}
                                        <img width="50" height="50" src="https://img.icons8.com/ios-filled/50/quote.png" alt="quote" />

                                        {/* Texte de l'avis */}
                                        <div className="prose prose-sm md:prose-base text-gray-700 leading-relaxed max-w-2xl">
                                            <BlocksRenderer
                                                content={el.description as any}
                                                modifiers={{
                                                    bold: ({ children }) => <strong className="text-secondary font-bold">{children}</strong>
                                                }}
                                            />
                                        </div>

                                        {/* Séparateur horizontal */}
                                        <div className="w-full border-b border-gray-200" />

                                        {/* Infos Client & Projet */}
                                        <div className="flex flex-col gap-4">
                                            <div>
                                                <Typography as='h3' className="font-bold text-lg text-gray-900 leading-tight">
                                                    {el.client_name}
                                                </Typography>
                                                <Typography as='p' className="text-gray-500 text-sm">
                                                    {el.pseudo_client}
                                                </Typography>
                                            </div>

                                            <div className="flex flex-wrap items-center gap-4 pt-2">
                                                <Typography as='h4' className="font-bold text-sm uppercase tracking-wider">
                                                    {el.entreprise_name}
                                                </Typography>

                                                <div className="flex flex-wrap gap-2">
                                                    {el.option_projet.map((opt, idx) => (
                                                        <span
                                                            key={idx}
                                                            className="bg-gray-100 text-gray-600 px-4 py-1.5 rounded-full text-[11px] font-medium"
                                                        >
                                                            {opt.options}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselIndicator />
                </Carousel>
            </div>
        </section>
    );
}