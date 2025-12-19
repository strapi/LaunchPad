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

    console.log({ props });


    return (
        <Card className=" m-8 mx-24 bg-tertiare p-8 rounded-sm shadown-none border-none">
            <CardContent className="grid lg:grid-cols-2">
                <div className="flex flex-col gap-6">
                    <CardTitle className="mb-2 w-full flex flex-col  gap-3">
                        <Typography variant="h3" className="text-3xl" >{props.heading}</Typography>
                        <div className="bg-black w-24 h-1" />
                    </CardTitle>
                    <CardDescription>
                        <Typography variant="p" className="text-foreground" >{props.sub_heading}</Typography>
                    </CardDescription>

                    {props?.image?.url && (
                        <BlurImage
                            src={strapiImage(props?.image?.url)}
                            alt={props.image?.alternativeText || ''}
                            width={150}
                            height={150}
                            className="w-full h-auto rounded-md mt-4"
                        />
                    )}

                    <Button asChild>
                        <Link href="/contact/expert" className="mt-4">
                            Parler a un expert
                        </Link>
                    </Button>
                </div>
                <div>
                    {
                        form_config && (
                            <DynamicStrapiForm
                                formConfig={form_config}
                                className=" p-8"
                            />
                        )
                    }
                </div>

            </CardContent>
        </Card>
    )
}
