import { IconShoppingCartUp } from '@tabler/icons-react';
import { createFileRoute } from '@tanstack/react-router';

import { Container } from '@/components/container';
import { AmbientColor } from '@/components/decorations/ambient-color';
import { FeatureIconContainer } from '@/components/dynamic-zone/features/feature-icon-container';
import { Heading } from '@/components/elements/heading';
import { Subheading } from '@/components/elements/subheading';
import { Featured } from '@/components/products/featured';
import { ProductItems } from '@/components/products/product-items';
import { ProductListSkeleton } from '@/components/skeletons/route-skeletons';
import { buildSeoMeta } from '@/lib/shared/metadata';

export const Route = createFileRoute('/$locale/products/')({
  loader: async ({ params, context }) => {
    const [pageResponse, productsResponse] = await Promise.all([
      context.strapiApi.products.getProductPageData({
        data: { locale: params.locale },
      }),
      context.strapiApi.products.getProducts({
        data: { locale: params.locale },
      }),
    ]);

    const pageData = pageResponse.data;
    const products = productsResponse.data;

    const localizedSlugs = (pageData?.localizations ?? []).reduce(
      (acc: Record<string, string>, localization: any) => {
        acc[localization.locale] = 'products';
        return acc;
      },
      { [params.locale]: 'products' }
    );

    return { pageData, products, localizedSlugs };
  },
  head: ({ loaderData }) => ({
    meta: buildSeoMeta(loaderData?.pageData?.seo),
  }),
  pendingComponent: ProductListSkeleton,
  component: ProductsIndex,
});

function ProductsIndex() {
  const { pageData, products } = Route.useLoaderData();
  const { locale } = Route.useParams();

  const featured = products.filter(
    (product: { featured?: boolean }) => product.featured
  );

  return (
    <div className="relative overflow-hidden w-full">
      <AmbientColor />
      <Container className="pt-40 pb-40">
        <FeatureIconContainer className="flex justify-center items-center overflow-hidden">
          <IconShoppingCartUp className="h-6 w-6 text-white" />
        </FeatureIconContainer>
        <Heading as="h1" className="pt-4">
          {pageData?.heading}
        </Heading>
        <Subheading className="max-w-3xl mx-auto">
          {pageData?.sub_heading}
        </Subheading>
        <Featured
          products={featured}
          locale={locale}
          heading={pageData?.featured_heading}
          sub_heading={pageData?.featured_sub_heading}
        />
        <ProductItems
          products={products}
          locale={locale}
          heading={pageData?.popular_heading}
          sub_heading={pageData?.popular_sub_heading}
        />
      </Container>
    </div>
  );
}
