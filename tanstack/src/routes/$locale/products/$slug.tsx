import { createFileRoute, notFound } from '@tanstack/react-router';

import { Container } from '@/components/container';
import { AmbientColor } from '@/components/decorations/ambient-color';
import DynamicZoneManager from '@/components/dynamic-zone/manager';
import { NotFound } from '@/components/not-found';
import { SingleProduct } from '@/components/products/single-product';
import { ProductSkeleton } from '@/components/skeletons/route-skeletons';
import { buildSeoMeta } from '@/lib/shared/metadata';

export const Route = createFileRoute('/$locale/products/$slug')({
  loader: async ({ params, context }) => {
    const [productResponse, globalResponse] = await Promise.all([
      context.strapiApi.products.getProductBySlug({
        data: { slug: params.slug, locale: params.locale },
      }),
      context.strapiApi.global.getGlobalData({
        data: { locale: params.locale },
      }),
    ]);

    const product = productResponse.data;
    if (!product) throw notFound();

    const localizedSlugs = (product.localizations ?? []).reduce(
      (acc: Record<string, string>, localization: any) => {
        acc[localization.locale] = `products/${localization.slug}`;
        return acc;
      },
      { [params.locale]: `products/${params.slug}` }
    );

    return {
      product,
      global: globalResponse.data,
      localizedSlugs,
    };
  },
  head: ({ loaderData }) => ({
    meta: buildSeoMeta(loaderData?.product?.seo),
  }),
  notFoundComponent: () => (
    <NotFound
      title="Product not found"
      message="We couldn't find a product with that slug."
    />
  ),
  pendingComponent: ProductSkeleton,
  component: SingleProductRoute,
});

function SingleProductRoute() {
  const { product, global } = Route.useLoaderData();
  const { locale } = Route.useParams();

  return (
    <div className="relative overflow-hidden w-full">
      <AmbientColor />
      <Container className="py-20 md:py-40">
        <SingleProduct
          product={product}
          locale={locale}
          addToCartText={global?.add_to_cart}
          buyNowText={global?.buy_now}
        />
        {product?.dynamic_zone && (
          <DynamicZoneManager
            dynamicZone={product.dynamic_zone}
            locale={locale}
          />
        )}
      </Container>
    </div>
  );
}
