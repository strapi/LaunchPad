import { type MDXComponents } from "mdx/types";
import Image, { type ImageProps } from "next/image";

export function useMDXComponents(components: MDXComponents) {
  return {
    ...components,
    Image: (props: ImageProps) => <Image {...props} />,
  };
}
