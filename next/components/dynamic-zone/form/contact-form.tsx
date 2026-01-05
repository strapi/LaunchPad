'use client';

import { DynamicStrapiForm } from "@/components/features/DynamicStrapiForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { StrapiFormConfig } from "@/types/strapi-form";
import { Image } from "@/types/types";
import { Typography } from '../../ui/typography';
import { BlurImage } from "@/components/blur-image";
import { strapiImage } from "@/lib/strapi/strapiImage";
import { Button } from "@/components/ui/button";
import { Link } from "next-view-transitions";

type ContactFormProps = {
    locale: string;
    heading: string;
    sub_heading: string;
    image: Image;
    form_config: StrapiFormConfig;
};

export function ContactForm({ form_config, ...props }: ContactFormProps) {

    return (
        <Card
            className="
                bg-tertiare
                rounded-sm
                shadown-none
                border-none
                p-6
                sm:p-8
                mx-4
                sm:mx-8
                md:mx-12
                lg:mx-24
                my-8
            "
        >
            <CardContent
                className="
                    grid
                    grid-cols-1
                    lg:grid-cols-2
                    gap-8
                    lg:gap-12
                "
            >
                {/* Bloc gauche */}
                <div className="flex flex-col gap-6">

                    <CardTitle className="mb-2 w-full flex flex-col gap-3">
                        <Typography
                            variant="h3"
                            className="text-2xl sm:text-3xl"
                        >
                            {props.heading}
                        </Typography>
                        <div className="bg-black w-20 sm:w-24 h-1" />
                    </CardTitle>

                    <CardDescription>
                        <Typography
                            variant="p"
                            className="text-foreground text-start text-base sm:text-lg"
                        >
                            {props.sub_heading}
                        </Typography>
                    </CardDescription>

                    {/* Image */}
                    {props?.image?.url && (
                        <BlurImage
                            src={strapiImage(props?.image?.url)}
                            alt={props.image?.alternativeText || ''}
                            width={150}
                            height={150}
                            className="
                                w-full
                                h-auto
                                mt-4
                                max-w-xs
                                sm:max-w-sm
                                md:max-w-md
                            "
                        />
                    )}

                    {/* CTA */}
                    <Button asChild className="w-fit mt-2">
                        <Link href="/contact/expert">
                            Parler a un expert
                        </Link>
                    </Button>
                </div>

                {/* Bloc droit : formulaire */}
                <div className="w-full">
                    {form_config && (
                        <DynamicStrapiForm
                            formConfig={form_config}
                            className="
                                p-4
                                sm:p-6
                                md:p-8
                            "
                        />
                    )}
                </div>

            </CardContent>
        </Card>
    );
}
