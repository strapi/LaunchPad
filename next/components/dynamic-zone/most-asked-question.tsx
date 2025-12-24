"use client";

import React, { useState } from 'react';
import { Typography } from "../ui/typography";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";

export interface MostAskedQuestionProps {
    heading: string;
    sub_heading: string;
    faqs: FAQ[];
}

export interface FAQ {
    question: string;
    answer: string;
}

export function MostAskedQuestion({ faqs, heading, sub_heading }: MostAskedQuestionProps) {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    const toggleAccordion = (index: number) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    return (
        <section className="w-full px-6 md:px-12 lg:px-24 py-16 md:py-24 bg-transparent">
            <div className="mx-auto flex flex-col items-center mb-12 md:mb-16">
                <Typography
                    as="h2"
                    className="font-bold text-primary text-center mb-4"
                >
                    {heading}
                </Typography>
                <Typography
                    as="p"
                    className='text-center'
                >
                    {sub_heading}
                </Typography>
            </div>

            <div className="max-w-4xl mx-auto flex flex-col gap-4">
                {faqs.map((faq, index) => (
                    <div
                        key={index}
                        className="rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-900 border border-border/50"
                    >
                        <button
                            onClick={() => toggleAccordion(index)}
                            className="w-full flex items-center justify-between p-5 md:p-6 text-left"
                        >
                            <Typography
                                as="span"
                                className="font-semibold pr-4"
                            >
                                {faq.question}
                            </Typography>
                            <div className="shrink-0 text-primary">
                                {activeIndex === index ? (
                                    <Minus className="size-5 md:size-6" />
                                ) : (
                                    <Plus className="size-5 md:size-6" />
                                )}
                            </div>
                        </button>

                        <AnimatePresence>
                            {activeIndex === index && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.3, ease: "easeInOut" }}
                                >
                                    <div className="px-5 pb-6 md:px-6 md:pb-8">
                                        <div className="h-[1px] bg-border/50 w-full mb-4" />
                                        <Typography
                                            as="p"
                                        // className="leading-relaxed"
                                        >
                                            {faq.answer}
                                        </Typography>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                ))}
            </div>
        </section>
    );
}