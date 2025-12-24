import { motion } from 'framer-motion';
import { strapiImage } from '@/lib/strapi/strapiImage';

interface HoverImageProps {
  imageUrl: string;
  initialSize: number;
  hoverSize: number;
  alt?: string;
  className?: string;
}

export default function HoverImage({
  imageUrl,
  initialSize,
  hoverSize,
  alt = 'Image',
  className = '',
}: HoverImageProps) {
  const fullImageUrl = strapiImage(imageUrl);

  return (
    <motion.div
  className={`overflow-hidden ${className}`}
  style={{
    position: 'relative',
    cursor: 'pointer',
    width: initialSize,
    height: '350px', 
  }}
  initial={{}}
  whileHover={{ width: hoverSize }}
  transition={{ duration: 0.3, ease: 'easeOut' }}
>
  <motion.img
    src={fullImageUrl}
    alt={alt}
    style={{
      width: hoverSize,  
      maxWidth: '100%',
      height: '100%',   
      objectFit: 'cover',
      objectPosition: 'center',
      filter: 'grayscale(100%)',
    }}   
    whileHover={{
      filter: 'grayscale(0%)',
    }}
    transition={{ filter: { duration: 0.3, ease: 'easeOut' } }}
  />
</motion.div>


  );
}