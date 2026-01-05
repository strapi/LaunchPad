'use client';

import { useState, useMemo } from 'react';
import { Spinner } from '@/components/ui/spinner';
import { useStrapiQuery } from '@/hooks/useStrapiQuery';
import { Projet, CategoryProjet, SecteurProjet, Service } from '@/types/types';
import { BlurImage } from '../../blur-image';
import { strapiImage } from '@/lib/strapi/strapiImage';
import { Typography } from '../../ui/typography';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Label } from '@/components/ui/label';

interface Props {
    collection: string;
    locale?: string;
}

export function DatatListZoneproject({ collection, locale }: Props) {
    // États pour les filtres
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [selectedSecteurs, setSelectedSecteurs] = useState<string[]>([]);
    const [selectedServices, setSelectedServices] = useState<string[]>([]);

    // Construction des filtres Strapi
    const strapiFilters = useMemo(() => {
        const filters: any = {};

        if (selectedCategories.length > 0) {
            filters.categories = {
                documentId: { $in: selectedCategories }
            };
        }

        if (selectedSecteurs.length > 0) {
            filters.secteurs = {
                documentId: { $in: selectedSecteurs }
            };
        }

        if (selectedServices.length > 0) {
            filters.services = {
                documentId: { $in: selectedServices }
            };
        }

        return filters;
    }, [selectedCategories, selectedSecteurs, selectedServices]);

    // Fetch des projets avec filtres
    const { data, isLoading, error } = useStrapiQuery<Projet[]>({
        collection: collection,
        filters: strapiFilters,
        sort: ['publishedAt:desc'],
        populate: {
            image: { fields: ['url', 'alternativeText'] },
            categories: { fields: ['name', 'documentId', 'slug'] },
            secteurs: { fields: ['name', 'documentId', 'slug'] },
            services: { fields: ['title', 'documentId', 'slug'] }
        },
        pagination: { page: 1, pageSize: 100 }
    });

    // Extraction des options de filtres uniques depuis les données
    const filterOptions = useMemo(() => {
        if (!data) return { categories: [], secteurs: [], services: [] };

        const categoriesMap = new Map<string, CategoryProjet>();
        const secteursMap = new Map<string, SecteurProjet>();
        const servicesMap = new Map<string, Service>();

        data.forEach(project => {
            project.categories?.forEach(c => categoriesMap.set(c.documentId, c));
            project.secteurs?.forEach(s => secteursMap.set(s.documentId, s));
            project.services?.forEach(sv => servicesMap.set(sv.documentId, sv));
        });

        return {
            categories: Array.from(categoriesMap.values()),
            secteurs: Array.from(secteursMap.values()),
            services: Array.from(servicesMap.values())
        };
    }, [data]);

    // Gestion des filtres pour Select (single selection)
    const handleCategoryChange = (value: string) => {
        if (value === 'all') {
            setSelectedCategories([]);
        } else {
            setSelectedCategories([value]);
        }
    };

    const handleSecteurChange = (value: string) => {
        if (value === 'all') {
            setSelectedSecteurs([]);
        } else {
            setSelectedSecteurs([value]);
        }
    };

    const handleServiceChange = (value: string) => {
        if (value === 'all') {
            setSelectedServices([]);
        } else {
            setSelectedServices([value]);
        }
    };

    const clearFilters = () => {
        setSelectedCategories([]);
        setSelectedSecteurs([]);
        setSelectedServices([]);
    };

    const activeFiltersCount = selectedCategories.length + selectedSecteurs.length + selectedServices.length;

    // Composant Badge de filtre actif
    const FilterBadge = ({ label, onRemove }: { label: string; onRemove: () => void }) => (
        <Badge
            variant="secondary"
            className="inline-flex items-center gap-1 px-3 py-1.5 cursor-pointer hover:bg-gray-200"
            onClick={onRemove}
        >
            {label}
            <X size={14} />
        </Badge>
    );

    if (isLoading) {
        return (
            <div className='w-full flex justify-center py-12'>
                <Spinner />
            </div>
        );
    }

    if (error) {
        return <div className='text-center py-8 text-red-500'>Erreur: {error.message}</div>;
    }

    return (
        <div className='w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-20 2xl:px-32 py-8'>
            {/* Barre de filtres avec Selects */}
            <div className='mb-8 space-y-4 mx-auto'>
                {/* Selects de filtres */}
                <div className='flex flex-col sm:flex-row gap-4 items-start sm:items-center '>
                    {/* Select Services */}
                    <div className='w-full flex items-center gap-4 p-1 px-4 border rounded sm:w-auto min-w-[200px]'>
                        <Label>Services</Label>
                        <Select
                            value={selectedServices[0] || 'all'}
                            onValueChange={handleServiceChange}
                        >
                            <SelectTrigger className="w-full min-w-[200px] bg-gray-100 shadow-none">
                                <SelectValue placeholder="Services" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Services</SelectItem>
                                {filterOptions.services.map(service => (
                                    <SelectItem key={service.documentId} value={service.documentId}>
                                        {service.title}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Select Catégorie */}
                    <div className='w-full flex items-center gap-4 p-1 px-4 border rounded sm:w-auto min-w-[200px]'>
                        <Label>Catégorie</Label>
                        <Select
                            value={selectedCategories[0] || 'all'}
                            onValueChange={handleCategoryChange}
                        >
                            <SelectTrigger className="w-full min-w-[200px] bg-gray-100 shadow-none">
                                <SelectValue placeholder="Catégorie" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Catégorie</SelectItem>
                                {filterOptions.categories.map(category => (
                                    <SelectItem key={category.documentId} value={category.documentId}>
                                        {category.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Select Secteurs */}
                    <div className='w-full flex items-center gap-4 p-1 px-4 border rounded sm:w-auto min-w-[200px]'>
                        <Label>Secteurs</Label>
                        <Select
                            value={selectedSecteurs[0] || 'all'}
                            onValueChange={handleSecteurChange}
                        >
                            <SelectTrigger className="w-full min-w-[200px] bg-gray-100 shadow-none">
                                <SelectValue placeholder="Secteurs" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Secteurs</SelectItem>
                                {filterOptions.secteurs.map(secteur => (
                                    <SelectItem key={secteur.documentId} value={secteur.documentId}>
                                        {secteur.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Compteur de résultats */}
                    {data && (
                        <Typography variant='small' className='text-gray-600 ml-auto whitespace-nowrap'>
                            {data.length} projet{data.length > 1 ? 's' : ''} trouvé{data.length > 1 ? 's' : ''}
                        </Typography>
                    )}
                </div>

                {/* Filtres actifs (badges) */}
                {activeFiltersCount > 0 && (
                    <div className='flex flex-wrap gap-2 items-center'>
                        <Typography variant='small' className='text-gray-600 font-medium'>
                            Filtres actifs:
                        </Typography>

                        {selectedCategories.map(id => {
                            const category = filterOptions.categories.find(c => c.documentId === id);
                            return category ? (
                                <FilterBadge
                                    key={id}
                                    label={category.name}
                                    onRemove={() => handleCategoryChange('all')}
                                />
                            ) : null;
                        })}

                        {selectedSecteurs.map(id => {
                            const secteur = filterOptions.secteurs.find(s => s.documentId === id);
                            return secteur ? (
                                <FilterBadge
                                    key={id}
                                    label={secteur.name}
                                    onRemove={() => handleSecteurChange('all')}
                                />
                            ) : null;
                        })}

                        {selectedServices.map(id => {
                            const service = filterOptions.services.find(s => s.documentId === id);
                            return service ? (
                                <FilterBadge
                                    key={id}
                                    label={service.title}
                                    onRemove={() => handleServiceChange('all')}
                                />
                            ) : null;
                        })}

                        <button
                            onClick={clearFilters}
                            className='text-sm text-gray-600 hover:text-gray-900 underline ml-2'
                        >
                            Tout effacer
                        </button>
                    </div>
                )}
            </div>

            {/* Grille des projets */}
            {data && data.length > 0 ? (
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 lg:gap-10'>
                    {data.map((item, index) => (
                        <ItemProject key={item.documentId} projet={item} index={index} />
                    ))}
                </div>
            ) : (
                <div className='text-center py-16 bg-gray-50 rounded-lg'>
                    <Typography variant='small' className='text-gray-600 mb-4'>
                        Aucun projet ne correspond à vos critères
                    </Typography>
                    {activeFiltersCount > 0 && (
                        <Button onClick={clearFilters} variant='outline'>
                            Réinitialiser les filtres
                        </Button>
                    )}
                </div>
            )}
        </div>
    );
}

const ItemProject = ({ projet, index }: { projet: Projet; index: number }) => {
    const isLarge = index % 3 === 0;

    // Créer une liste de tags depuis les relations
    const tags = [
        ...(projet.categories?.map(c => c.name) || []),
        ...(projet.secteurs?.map(s => s.name) || []),
        ...(projet.services?.map(sv => sv.title) || [])
    ].slice(0, isLarge ? 4 : 3);

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
                <Typography>
                    {projet.sub_heading}
                </Typography>

                {/* Tags/Categories */}
                {tags.length > 0 && (
                    <div className='flex flex-wrap gap-2'>
                        {tags.map((tag, i) => (
                            <Badge
                                key={i}
                                className='px-4 py-1.5 text-xs font-medium bg-tertiare text-gray-700 border border-gray-200 hover:bg-gray-200 transition-colors'
                            >
                                {tag}
                            </Badge>
                        ))}
                    </div>
                )}

                {/* Séparateur */}
                <div className='w-full h-px bg-black/80' />

                {/* Bouton */}
                <Button
                    className='text-white font-semibold px-6 py-3 rounded-lg transition-all duration-300 hover:shadow-lg w-full md:w-auto self-start'
                >
                    Visiter le site
                </Button>
            </div>
        </div>
    );
};