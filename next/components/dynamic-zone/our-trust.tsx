import Image from 'next/image';
import Link from 'next/link';
import { Button as ElementButton } from '../elements/button';
import { Typography } from '../ui/typography';
import { strapiImage } from '@/lib/strapi/strapiImage';

export interface OurTrustProps {
    heading: string;
    background_colors: string;
    our_trust_items: OurTrustItem[];
    locale: string
}

interface OurTrustItem {
    client_name: string;
    client_post: string;
    description: string;
    image: ClientPhoto;
    client_photo: ClientPhoto;
    button: Button[];
    entreprise_logo: EntrepriseLogo;
}

interface Button {
    id: number;
    text: string;
    URL: string;
    target: null;
    variant: string;
}

interface ClientPhoto {
    alternativeText: null;
    url: string;
}


export interface EntrepriseLogo {
    alternativeText: null;
    url: string;
}

export function OurTrust({
    background_colors,
    heading,
    our_trust_items,
    locale,
}: OurTrustProps) {
    return (
        <div
            className="w-full px-6 md:px-12 lg:px-20 py-20 md:py-16"
            style={{
                backgroundColor: background_colors ? background_colors : 'transparent',
            }}
        >
            <div className="max-w-6xl mx-auto">
                <Typography as="h2" className="font-bold text-white text-2xl mb-10">
                    {heading}
                </Typography>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {our_trust_items.map((el, index) => (
                        <div
                            key={index}
                            className="bg-white overflow-hidden flex flex-col shadow-md max-w-sm lg:max-w-md mx-auto w-full"
                        >
                            <div className="relative h-[180px] md:h-[220px] w-full">
                                <Image
                                    src={strapiImage(el.image?.url)}
                                    alt={el.client_name}
                                    fill
                                    className="object-cover"
                                />
                                <div className="absolute bottom-3 left-3 bg-black/40 border border-white/10 p-1.5 pr-4 rounded-xl flex items-center gap-2 text-white">
                                    <div className="relative w-15 h-15 rounded-full overflow-hidden border border-white/30">
                                        <Image
                                            src={strapiImage(el.entreprise_logo?.url)}
                                            alt={el.client_name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <div className="flex flex-col">
                                        <Typography as='h3' className="font-bold">
                                            {el.client_name}
                                        </Typography>
                                        <Typography as='p'>
                                            {el.client_post}
                                        </Typography>
                                    </div>
                                </div>
                            </div>

                            <div className="p-5 md:p-6 flex flex-col gap-4">
                                <div className="flex items-center gap-2.5">
                                    <div className="relative w-15 h-15 rounded-full overflow-hidden">
                                        <Image
                                            src={strapiImage(el.client_photo?.url)}
                                            alt={el.client_name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <div className="flex flex-col">
                                        <Typography className="font-bold text-gray-900 text-[13px] leading-tight">
                                            {el.client_name}
                                        </Typography>
                                        <Typography className="text-gray-400 text-[10px] font-semibold uppercase">
                                            {el.client_post}
                                        </Typography>
                                    </div>
                                </div>

                                <Typography className="text-black text-[12px] leading-snug italic">
                                    {el.description}
                                </Typography>

                                {el.button.map((el, index) => (
                                    <ElementButton
                                        as={Link}
                                        key={index}
                                        href={`/${locale}${el.URL}`}
                                        variant={el.variant as any}
                                        className={
                                            el.variant === 'primary'
                                                ? 'bg-primary border-0 hover:bg-primary text-white w-40'
                                                : 'w-40'
                                        }
                                    >
                                        {el.text}
                                    </ElementButton>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
