/**
 * Optimización de imágenes para componentes React.
 * <Image> de astro:assets solo se usa en archivos .astro y los componentes React
 * renderizan de forma síncrona: la página llama a getImage() en el build y pasa
 * a cada componente src, srcset y dimensiones ya resueltos.
 */
import { getImage } from 'astro:assets';
import type { ImageMetadata } from 'astro';

export interface ResponsiveImage {
  src: string;
  srcSet: string;
  width: number;
  height: number;
}

export async function optimize(
  image: ImageMetadata,
  widths: number[],
  format: 'webp' | 'avif' = 'webp',
): Promise<ResponsiveImage> {
  const usable = widths.filter((w) => w <= image.width);
  const largest = usable.at(-1) ?? image.width;
  const result = await getImage({ src: image, widths: usable.length ? usable : [image.width], width: largest, format });
  return {
    src: result.src,
    srcSet: result.srcSet.attribute,
    width: largest,
    height: Math.round((image.height / image.width) * largest),
  };
}
