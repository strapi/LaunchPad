import Image from "next/image";
import { unstable_noStore as noStore } from 'next/cache';
import { ComponentProps } from 'react';

interface StrapiImageProps extends Omit<ComponentProps<typeof Image>, 'src' | 'alt'> {
  src: string;
  alt: string | null;
}

export function getStrapiMedia(url: string | null) {
  const strapiURL = process.env.NEXT_PUBLIC_API_URL;
  if (url == null) return null;
  if (url.startsWith("data:")) return url;
  if (url.startsWith("http") || url.startsWith("//")) return url;
  if (url.startsWith("/")) {
    if (!strapiURL && document?.location.host.endsWith(".strapidemo.com")) {
      return `https://${document.location.host.replace("client-", "api-")}${url}`
    }
    return strapiURL + url
  }
  return `${strapiURL}${url}`;
}

export function StrapiImage({
  src,
  alt,
  className,
  ...rest
}: Readonly<StrapiImageProps>) {
  noStore();
  const imageUrl = getStrapiMedia(src);
  if (!imageUrl) return null;
  return (
    <Image 
      src={imageUrl}
      alt={alt ?? "No alternative text provided"}
      className={className}
      {...rest}
    />
  );
}




