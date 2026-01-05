import { Typography } from '../ui/typography';
import Image from 'next/image';
import { strapiImage } from '@/lib/strapi/strapiImage';

export interface WhoAreWeProps {
    heading: string;
    sub_heading: string;
    background_color: string;
    images: Image[];
    three_words: ThreeWords;
}

export interface Image {
    alternativeText: string | null;
    url: string;
}

export interface ThreeWords {
    id: number;
    word1: string;
    word2: string;
    word3: string;
}

export function Who_are_we({
    heading,
    images,
    sub_heading,
    background_color,
    three_words
}: WhoAreWeProps) {
    return (
        <section
            style={{
                backgroundColor: background_color || '#f4faff',
            }}
            className="w-full px-6 md:px-12 lg:px-20 py-16 md:py-24"
        >
            {/* --- SECTION HAUT (Responsive : Colonne sur mobile, Ligne sur Desktop) --- */}
            <div className="flex flex-col lg:flex-row justify-between items-start gap-8 lg:gap-16 mb-20 md:mb-32">
                <div className="w-full lg:w-1/2">
                    <h2 className="font-bold text-4xl md:text-6xl lg:text-7xl leading-[1.1] tracking-tight text-black">
                        {heading}
                    </h2>
                    {/* Ligne de séparation */}
                    <div className="h-[1px] bg-black/20 w-full mt-8 md:mt-12 max-w-md"></div>
                </div>

                <div className="w-full lg:w-[45%]">
                    <p className="text-sm md:text-base lg:text-lg text-gray-700 leading-relaxed whitespace-pre-line pt-2">
                        {sub_heading}
                    </p>
                </div>
            </div>

            {/* --- SECTION GRILLE (Responsive : 1 col mobile, 3 cols desktop) --- */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-y-12 md:gap-x-8 lg:gap-x-12 items-start">

                {/* 1. WE + IMAGE */}
                <div className="flex flex-col">
                    <h3 className="text-6xl md:text-7xl lg:text-[7rem] font-bold uppercase leading-none tracking-tighter mb-4 md:mb-0">
                        {three_words.word1}
                    </h3>
                    <div className="relative aspect-[4/5] w-full overflow-hidden rounded-sm">
                        <Image
                            src={strapiImage(images[0]?.url)}
                            alt={images[0]?.alternativeText || ''}
                            fill
                            className="object-cover"
                        />
                    </div>
                </div>

                {/* 2. IMAGE + ARE (Inversé sur desktop, reste logique sur mobile pour la fluidité) */}
                <div className="flex flex-col md:flex-col-reverse">
                    <h3 className="text-6xl md:text-7xl lg:text-[7rem] font-bold uppercase leading-none tracking-tighter mt-4 md:mt-0">
                        {three_words.word2}
                    </h3>
                    <div className="relative aspect-[4/5] md:aspect-square w-full overflow-hidden rounded-sm">
                        <Image
                            src={strapiImage(images[1]?.url)}
                            alt={images[1]?.alternativeText || ''}
                            fill
                            className="object-cover"
                        />
                    </div>
                </div>

                {/* 3. SODIBIZ + IMAGE */}
                <div className="flex flex-col">
                    <h3 className="text-6xl md:text-7xl lg:text-[7rem] font-bold uppercase leading-none tracking-tighter mb-4 md:mb-0">
                        {three_words.word3}
                    </h3>
                    <div className="relative aspect-[4/5] w-full overflow-hidden rounded-sm">
                        <Image
                            src={strapiImage(images[2]?.url)}
                            alt={images[2]?.alternativeText || ''}
                            fill
                            className="object-cover"
                        />
                    </div>
                </div>

            </div>
        </section>
    );
}