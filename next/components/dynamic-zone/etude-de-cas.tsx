import { Typography } from "../ui/typography";

export interface EtudeDeCasProps {
    heading: string;
    secteur_etude_cas: string;
    probleme_title: string;
    probleme_description: string;
    solution_title: string;
    solution_description: string;
    background_color: string;
    solition_appporter_resultat: SolitionAppporterResultat[];
}

export interface SolitionAppporterResultat {
    heading: string;
    sub_heading: string;
    image: null;
}

export function EtudeDeCas({
    background_color,
    heading,
    probleme_description,
    probleme_title,
    secteur_etude_cas,
    solition_appporter_resultat,
    solution_description,
    solution_title
}: EtudeDeCasProps) {
    return (
        <section className="w-full px-6 md:px-12 lg:px-24 py-12 flex justify-center items-center">
            <div
                className="border border-border rounded-3xl p-8 md:p-12 lg:p-16 flex flex-col gap-10 max-w-7xl"
                style={{ backgroundColor: background_color ? background_color : "transparent" }}
            >
                <Typography as="h2" className="text-center font-bold text-primary text-2xl md:text-3xl lg:text-4xl">
                    {heading}
                </Typography>
                <Typography as="h3" className="font-bold text-blue-500">
                    {secteur_etude_cas}
                </Typography>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                    <div className="lg:col-span-7 space-y-8 text-start">


                        <div className="space-y-3">
                            <Typography as="h4" className="font-bold">
                                {probleme_title}
                            </Typography>
                            <Typography as="p" className="leading-relaxed">
                                {probleme_description}
                            </Typography>
                        </div>

                        <div className="space-y-3">
                            <Typography as="h4" className="font-bold">
                                {solution_title}
                            </Typography>
                            <Typography as="p" className="leading-relaxed">
                                {solution_description}
                            </Typography>
                        </div>
                    </div>

                    <div className="lg:col-span-5 flex flex-col gap-8 lg:pl-10">
                        {solition_appporter_resultat.map((item, index) => (
                            <div key={index} className="flex flex-col gap-1">
                                <Typography className="text-blue-600 font-bold">
                                    {item.heading}
                                </Typography>
                                <Typography as="span" className="font-bold">
                                    {item.sub_heading}
                                </Typography>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}