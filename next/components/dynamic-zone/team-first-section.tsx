import Image from 'next/image'
import { Typography } from '../ui/typography'
import { strapiImage } from '@/lib/strapi/strapiImage'

export interface TeamFirstSectionProps {
    heading: string
    sub_heading: string
    image: ImageType
}

export interface ImageType {
    alternativeText: null | string
    url: string
}

export function TeamFirstSection({
    heading,
    image,
    sub_heading,
}: TeamFirstSectionProps) {
    return (
        <section className="w-full px-6 md:px-12 lg:px-24 py-20">
            <div className="max-w-4xl">
                <Typography
                    as="h2"
                    className="font-bold text-primary text-xl mb-6"
                >
                    {heading}
                </Typography>

                <Typography
                    as="p"
                    className="text-base leading-relaxed mb-10 font-bold"
                >
                    {sub_heading}
                </Typography>
            </div>

            <div className="border-b border-black w-full mb-20" />

            <div className="relative w-full h-[520px]">
                <Image
                    src={strapiImage(image.url)}
                    alt={image.alternativeText || 'Image'}
                    fill
                    className="object-cover"
                />
            </div>
        </section>
    )
}
