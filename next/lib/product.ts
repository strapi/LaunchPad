import { products } from "@/data/products";

export const getAllProducts = async () => {
  // Ideally a DB call here
  return products;
};

export const getProduct = async (slug: string) => {
  // Ideally a DB call here
  return products.find((product) => product.slug === slug);
};

export const getRelatedProducts = async (slug: string) => {
  // Ideally a DB call here
  const filteredProducts = products.filter((product) => product.slug !== slug);
  return filteredProducts.slice(0, 3);
};
