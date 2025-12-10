'use client';

import { DynamicStrapiForm } from "@/components/features/DynamicStrapiForm";
import { StrapiFormConfig } from "@/types/strapi-form";


type ContactFormProps = {
    locale: string;
    form_config: StrapiFormConfig;
};


export function ContactForm({ ...props }: ContactFormProps) {

    console.log({props});
    

    return (
        <div>
            {/* <DynamicStrapiForm
                formConfig={form_config}
                className="bg-white rounded-lg shadow-lg p-8"
            /> */}
        </div>
    )
}
