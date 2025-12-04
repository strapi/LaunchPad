import { generateMetadataObject } from '@/lib/shared/metadata';
import fetchContentType from '@/lib/strapi/fetchContentType';
import { Metadata } from 'next';
import React from 'react'

export async function generateMetadata(props: {
    params: Promise<{ locale: string }>;
}): Promise<Metadata> {
    const params = await props.params;

    const pageData = await fetchContentType(
        'product-page',
        {
            filters: {
                locale: params.locale,
            },
        },
        true
    );

    const seo = pageData?.seo;
    const metadata = generateMetadataObject(seo);
    return metadata;
}

export default async function Services(props: {
    params: Promise<{ locale: string }>;
}) {
    const params = await props.params;

    // Fetch les donnees et recuperer les data de services
    const productPage = await fetchContentType(
        'services',
        {
            filters: {
                locale: params.locale,
            },
        },
        true
    );
    const services = await fetchContentType('services');

    const localizedSlugs = productPage?.localizations?.reduce(
        (acc: Record<string, string>, localization: any) => {
            acc[localization.locale] = 'services';
            return acc;
        },
        { [params.locale]: 'services' }
    );
    const featured = services?.data.filter(
        (product: { featured: boolean }) => product.featured
    );

    console.log("Donnees venant du Backend : ", productPage, services);

    return (
        <div >
        </div>
    );
}