'use client';


import { DataSource } from '@/components/features/DataSource';
import { Spinner } from '@/components/ui/spinner';
import { useStrapiQuery } from '@/hooks/useStrapiQuery';
import { Projet } from '@/types/types';
import { useState } from 'react';

// Exemple 1: Utilisation du composant DataSource
export function ProjectList() {
    return (
        <DataSource
            collection="articles"
            filters={{
                status: { $eq: 'published' },
                category: { $in: ['tech', 'design'] }
            }}
            sort={['publishedAt:desc']}
            populate="*"
            pagination={{ page: 1, pageSize: 10 }}
        >
            {(data, loading, error, refetch) => {
                if (loading) return (<div className='w-full justify-center'>
                    <Spinner />
                </div>);
                if (error) return <div>Erreur: {error.message}</div>;

                return (
                    <div>
                        <button onClick={refetch}>Rafraîchir</button>
                        {data.map((article: any) => (
                            <div key={article.documentId}>
                                <h2>{article.title}</h2>
                            </div>
                        ))}
                    </div>
                );
            }}
        </DataSource>
    );
}