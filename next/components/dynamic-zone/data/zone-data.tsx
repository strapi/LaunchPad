'use client';

import { Spinner } from '@/components/ui/spinner';
import { useStrapiQuery } from '@/hooks/useStrapiQuery';
import { Projet } from '@/types/types';
import { BlurImage } from '../../blur-image';
import { strapiImage } from '@/lib/strapi/strapiImage';
import { Typography } from '../../ui/typography';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface Props {
    collection: string;
    locale?: string;
}

export function DatatListZone({ collection, locale }: Props) {
    const { data, isLoading, error } = useStrapiQuery<Projet[]>({
        collection: collection,
        filters: {},
        sort: ['publishedAt:desc'],
        populate: "*",
        pagination: { page: 1, pageSize: 10 }
    });

    if (isLoading) {
        return (
            <div className='w-full flex justify-center py-12'>
                <Spinner />
            </div>
        );
    }

    if (error) return <div className='text-center py-8 text-red-500'>Erreur: {error.message}</div>;

    return (
        <div className='w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-20 2xl:px-32 py-8'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 lg:gap-10'>
                {data && data.map((item, index) => {
                    return <ItemProject key={item.documentId} projet={item} index={index} />
                })}
            </div>
        </div>
    );
}

const ItemProject = ({ projet, index }: { projet: Projet, index: number }) => {
    const isLarge = index % 3 === 0;

    return (
        <div
            className={cn(
                'group cursor-pointer flex flex-col gap-5',
                'col-span-1',
                'md:col-span-2',
                {
                    'md:col-span-1': !isLarge,
                }
            )}
        >
            {/* Image */}
            <div
                className={cn(
                    'relative overflow-hidden rounded-xl bg-gray-100',
                    isLarge ? 'aspect-[14/10]' : 'aspect-[4/3]'
                )}
            >
                <BlurImage
                    src={strapiImage(projet?.image?.url ?? 'not-found')}
                    alt={projet.heading}
                    height="800"
                    width="1400"
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
            </div>

            {/* Contenu texte */}
            <div className='flex flex-col gap-4'>
                {/* Titre */}
                <Typography
                    variant='h4'
                    className='text-primary'
                >
                    {projet.heading}
                </Typography>

                {/* Description */}
                <Typography
                    className=''
                >
                    {projet.sub_heading}
                </Typography>

                {/* Tags/Categories */}
                <div className='flex flex-wrap gap-2'>
                    {['UX Research', 'UI Design', 'Developpement', 'Mobile'].slice(0, isLarge ? 4 : 3).map((tag, i) => (
                        <span
                            key={i}
                            className='px-4 py-1.5 text-xs font-medium bg-gray-100 text-gray-700 rounded-full border border-gray-200 hover:bg-gray-200 transition-colors'
                        >
                            {tag}
                        </span>
                    ))}
                </div>

                {/* Séparateur */}
                <div className='w-full h-px bg-black' />

                {/* Bouton */}
                <Button
                    className='text-white font-semibold px-6 py-3 rounded-lg transition-all duration-300 hover:shadow-lg w-full md:w-auto self-start'
                >
                    Visiter le site
                </Button>
            </div>
        </div>
    );
}