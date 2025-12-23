import Image from "next/image";
import { Typography } from "../ui/typography";
import { strapiImage } from "@/lib/strapi/strapiImage";

export interface OurVisionOfDeveloppementProps {
    heading: string;
    sub_heading: string;
    image: {
        url: string;
    };
}

export function OurVisionOfDeveloppement({ heading, sub_heading, image }: OurVisionOfDeveloppementProps) {
    return (
        <section className="w-full px-6 md:px-12 lg:px-24 py-16 md:py-24 bg-transparent">
            <div className="mx-auto flex flex-col items-center gap-8">
                <Typography
                    as='h2'
                    className="font-bold text-2xl md:text-3xl lg:text-4xl text-center leading-tight"
                >
                    {heading}
                </Typography>
                <Typography
                    as='p'
                    className="text-center text-muted-foreground text-sm md:text-base lg:text-lg leading-relaxed max-w-3xl"
                >
                    {sub_heading}
                </Typography>
                <div className="relative w-full aspect-[21/9] mt-4 border-[3px] overflow-hidden shadow-2xl">
                    <Image
                        src={strapiImage(image?.url)}
                        alt={heading}
                        fill
                        priority
                        className="object-cover object-center"
                    />
                </div>
            </div>
        </section>
    )
}