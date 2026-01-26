"use client";

import React, { useRef, useState } from "react";
import { motion, useAnimationFrame, useMotionValue, useTransform } from "framer-motion";

interface InfiniteSliderProps {
    children: React.ReactNode[];
    direction?: "horizontal" | "vertical";
    speed?: number;
    speedOnHover?: number;
    className?: string;
    itemsVisibleOnscreen?: number;
}

export const InfiniteSlider = ({
    children,
    direction = "horizontal",
    speed = 50,
    speedOnHover = 20,
    className = "",
    itemsVisibleOnscreen = 5,
}: InfiniteSliderProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    // État pour la vitesse actuelle et la position
    const [currentSpeed, setCurrentSpeed] = useState(speed);
    const baseTranslation = useMotionValue(0);

    // On duplique les enfants pour assurer la continuité
    const duplicatedChildren = [...children, ...children];

    useAnimationFrame((time, delta) => {
        if (!contentRef.current) return;

        // Calcul du déplacement basé sur le temps (delta) pour la fluidité
        const moveBy = (currentSpeed * delta) / 1000;
        let newTranslation = baseTranslation.get() - moveBy;

        // Calcul de la taille d'une seule série d'éléments
        const contentSize = direction === "horizontal"
            ? contentRef.current.scrollWidth / 2
            : contentRef.current.scrollHeight / 2;

        // Reset de la position quand on a dépassé la moitié (boucle infinie)
        if (Math.abs(newTranslation) >= contentSize) {
            newTranslation = 0;
        }

        baseTranslation.set(newTranslation);
    });

    // Transforme la valeur brute en style CSS
    const x = useTransform(baseTranslation, (v) => (direction === "horizontal" ? v : 0));
    const y = useTransform(baseTranslation, (v) => (direction === "vertical" ? v : 0));

    return (
        <div
            ref={containerRef}
            className={`relative overflow-hidden w-full ${className}`}
            onMouseEnter={() => setCurrentSpeed(speedOnHover)}
            onMouseLeave={() => setCurrentSpeed(speed)}
        >
            <motion.div
                ref={contentRef}
                style={{ x, y }}
                className={`flex ${direction === "horizontal" ? "flex-row" : "flex-column"} w-max`}
            >
                {duplicatedChildren.map((child, index) => (
                    <div
                        key={index}
                        className="flex-shrink-0"
                        style={{
                            // On affiche itemsVisibleOnscreen éléments sur 70% de la largeur du conteneur parent
                            width: direction === "horizontal"
                                ? `calc((100vw * 0.7) / ${itemsVisibleOnscreen !== 5 ? itemsVisibleOnscreen : 5})`
                                : "auto",
                            height: direction === "vertical"
                                ? `calc((100vh * 0.7) / ${itemsVisibleOnscreen !== 5 ? itemsVisibleOnscreen : 5})`
                                : "auto",
                            padding: "0 10px", // Espacement optionnel
                        }}
                    >
                        {child}
                    </div>
                ))}
            </motion.div>
        </div>
    );
};