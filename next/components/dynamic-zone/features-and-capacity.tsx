import Image from "next/image";
import { Typography } from "../ui/typography";
import { strapiImage } from "@/lib/strapi/strapiImage";

export interface FeaturesAndCapacityProps {
    heading: string;
    background_color: string;
    features_items: FeaturesItem[];
}

export interface FeaturesItem {
    title: string;
    description: string;
    image: {
        url: string;
    } | null;
}

export function FeaturesAndCapacity({ background_color, features_items, heading }: FeaturesAndCapacityProps) {
    return (
        <section
            style={{ backgroundColor: background_color ? background_color : "transparent" }}
            className="w-full px-6 md:px-12 lg:px-24 py-16 md:py-24"
        >
            <div className="max-w-7xl mx-auto">
                <Typography as="h2" className="text-center font-bold mb-16 md:mb-20">
                    {heading}
                </Typography>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12 md:gap-y-16">
                    {features_items.map((item, index) => (
                        <div key={index} className="flex flex-col items-center text-center group">
                            <div className="relative w-12 h-12 mb-6 flex items-center justify-center">
                                {item.image ? (
                                    <Image
                                        src={strapiImage(item.image.url)}
                                        alt={item.title}
                                        fill
                                        className="object-contain"
                                    />
                                ) : (
                                    null
                                )}
                            </div>

                            <Typography as="p" className="font-bold mb-3">
                                {item.title}
                            </Typography>

                            <Typography as="p" className="opacity-70 leading-relaxed max-w-[240px]">
                                {item.description}
                            </Typography>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}