import { title } from "process"
import { Image } from "@/types/types";

export interface Paragraph {
    title?: string;
    text?: string;
}

export interface Button {
    text?: string;
    URL?: string;
    target?: string;
    variant: "simple" | "primary" | "outline" | "muted";
}

export interface FeaturedProjectProps {
    title?: string;
    logo?: Image;
    paragraphs: Paragraph[];
    CTAs: Button[];
    images: Image[];
}