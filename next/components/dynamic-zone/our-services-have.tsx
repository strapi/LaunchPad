import { CheckCircle2, Code } from "lucide-react";
import { Typography } from "../ui/typography";

export interface OurServicesHaveProps {
    heading: string;
    services_have_items: ServicesHaveItem[];
}

interface ServicesHaveItem {
    heading: string;
    sub_heading: string;
    items_services: ItemsService[];
}

interface ItemsService {
    title: string;
}

export function OurServicesHave({ heading, services_have_items }: OurServicesHaveProps) {
    return (
        <section className="w-full h-full px-6 md:px-12 lg:px-24 py-16 md:py-24 bg-transparent">
            <div className="max-w-7xl mx-auto flex flex-col items-center">
                <Typography
                    as="h2"
                    className="font-bold text-2xl md:text-3xl lg:text-4xl mb-12 text-center"
                >
                    {heading}
                </Typography>

                <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-6">
                    {services_have_items.map((el, index) => (
                        <div
                            key={index}
                            className="group border border-border rounded-3xl p-8 flex flex-col items-start transition-all hover:shadow-lg bg-card/50"
                        >
                            {/* Icon Container */}
                            <div className="bg-primary/20 p-4 rounded-2xl flex justify-center items-center mb-8">
                                <Code className="size-8 text-primary" />
                            </div>

                            {/* Heading */}
                            <Typography
                                as="h3"
                                className="font-bold text-xl md:text-2xl mb-4"
                            >
                                {el.heading}
                            </Typography>

                            {/* Subheading */}
                            <Typography
                                as="p"
                                className="text-muted-foreground text-sm md:text-base leading-relaxed mb-8"
                            >
                                {el.sub_heading}
                            </Typography>

                            {/* Service Items List */}
                            <div className="flex flex-col gap-4 mt-auto w-full">
                                {el.items_services.map((ol, idx) => (
                                    <div key={idx} className="flex gap-3 items-center">
                                        <CheckCircle2 className="size-5 text-primary shrink-0" />
                                        <Typography
                                            as="span"
                                            className="text-sm md:text-base opacity-80"
                                        >
                                            {ol.title}
                                        </Typography>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}