import { BlocksRenderer } from '@strapi/blocks-react-renderer';
import Image from 'next/image';
import { Typography } from '../ui/typography';
import { strapiImage } from '@/lib/strapi/strapiImage';

export type AvisClientProps = {
    avis_clients: avis_clients[];
};

type avis_clients = {
    client_name: string;
    entreprise_name: string;
    id: number | string;
    pseudo_client: string;
    client_photo: client_photo;
    description: any[];
    option_projet: option_projet[];
};

type client_photo = {
    url: string;
};

type option_projet = {
    options: string;
};

export function AvisClients({ avis_clients }: AvisClientProps) {
    return (
        <section className="w-full py-24 px-6 md:px-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
                {avis_clients.map((el, index) => (
                    <div
                        key={index}
                        className="space-y-1 p-8 md:p-10 rounded-2xl shadow-lg border border-gray-100 flex flex-col h-full"
                    >
                        <img width="50" height="50" src="https://img.icons8.com/ios-filled/50/quote.png" alt="quote" />

                        <div className="flex-1 leading-relaxed mb-8 prose prose-sm max-w-none">
                            <BlocksRenderer
                                content={el.description as any}
                                modifiers={{
                                    bold: ({ children }) => <strong className="text-secondary font-bold">{children}</strong>
                                }}
                            />
                        </div>

                        <div className="w-full border-b border-foreground mb-6" />

                        <div className="flex items-center gap-4 mt-auto">
                            <div className="relative w-12 h-12 shrink-0">
                                <Image
                                    src={strapiImage(el.client_photo?.url)}
                                    alt={el.client_name}
                                    fill
                                    className="rounded-full object-cover"
                                />
                            </div>

                            <div className="flex flex-col min-w-0">
                                <Typography as="h4" className="font-bold truncate">
                                    {el.client_name}
                                </Typography>
                                <Typography as="span" className="text-gray-500 text-sm truncate">
                                    {el.pseudo_client}
                                </Typography>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}