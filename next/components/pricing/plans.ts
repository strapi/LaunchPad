import { Locale } from "@/config";

export type Plan = {
    title: string;
    subtitle?: string;
    description: string;
    price: string;
    features: {
        content: string | React.ReactNode;
    }[];
    additionalFeatures?: {
        content: string | React.ReactNode;
    }[];
    featured?: boolean;
    exception?: boolean;
    ctaText?: string;
};

const englishPlans: Plan[] = [
    {
        title: "Starter Shuttle",
        description: "Perfect for small payloads and beginner missions.",
        price: "100",
        subtitle: "launch",
        features: [
            {
                content: "Launch upto 1,000 content items",
            },
            {
                content: "Basic Mission Control Dashboard",
            },
            {
                content: "Standard Delivery",
            },
            {
                content: "Basic analytics",
            },
        ],
        featured: false,
        ctaText: "Get Started",
    },
    {
        title: "Pro Rocket",
        description: "Ideal for medium-sized payloads and regular missions.",
        price: "3000",
        subtitle: "launch",
        features: [
            {
                content: "Launch upto 100,000 content items",
            },
            {
                content: "Advanced Mission Control Dashboard",
            },
            {
                content: "High Speed Delivery",
            },
            {
                content: "Advanced analytics",
            },
            {
                content: "Priority Support",
            },
        ],
        additionalFeatures: [
            {
                content: "Everything included from Starter Shuttle",
            },
        ],
        featured: false,
        ctaText: "Get Started",
    },
    {
        title: "Team Explorer",
        description: "Great for teams with larger content needs.",
        price: "15,000",
        subtitle: "launch",
        features: [
            {
                content: "Launch upto 1,000,000 content items",
            },
            {
                content: "Collaborative Mission Control Dashboard",
            },
            {
                content: "High-Speed Delivery",
            },
            {
                content: "Advanced analytics and reporting",
            },
            {
                content: "Priority Support",
            },
            {
                content: "Team collaboration tools",
            },
        ],
        additionalFeatures: [
            {
                content: "Everything included from Starter Shuttle",
            },
            {
                content: "Everything included from Pro Rocket",
            },
        ],
        featured: true,
        ctaText: "Get Started",
    },
    {
        title: "Enterprise Shuttle",
        description: "Custom solutions for large payloads and frequent launches",
        price: "Contact us",
        features: [
            {
                content: "Unlimited content items per launch",
            },
            {
                content: "Customizable Mission Control Dashboard",
            },
            {
                content: "Ultra-Speed Delivery",
            },
            {
                content: "Comprehensive analytics and reporting",
            },
            {
                content: "Dedicated Support Team",
            },
            {
                content: "Custom Integrations and Solutions",
            },
        ],
        additionalFeatures: [
            {
                content: "Everything included from Starter Shuttle",
            },
            {
                content: "Everything included from Pro Rocket",
            },
            {
                content: "Everything included from Team Explorer",
            },
        ],
        featured: false,
        exception: true,
        ctaText: "Contact Us",
    },
];


/* translated english to french plans */
const frenchPlans: Plan[] = [
    {
        title: "Navette de Démarrage",
        description: "Parfait pour les petits projets et les lancements occasionnels",
        price: "9",
        subtitle: "lancement",
        features: [
            {
                content: "Jusqu'à 10 éléments de contenu par lancement",
            },
            {
                content: "Tableau de bord de contrôle de mission de base",
            },
            {
                content: "Livraison standard",
            },
            {
                content: "Analyses de base",
            },
            {
                content: "Support par e-mail",
            },
        ],
        featured: false,
        ctaText: "Commencer",
    },
    {
        title: "Fusée Pro",
        description: "Idéal pour les créateurs de contenu réguliers et les petites équipes",
        price: "29",
        subtitle: "lancement",
        features: [
            {
                content: "Jusqu'à 50 éléments de contenu par lancement",
            },
            {
                content: "Tableau de bord de contrôle de mission avancé",
            },
            {
                content: "Livraison rapide",
            },
            {
                content: "Analyses détaillées",
            },
            {
                content: "Support prioritaire",
            },
            {
                content: "Intégrations de base",
            },
        ],
        additionalFeatures: [
            {
                content: "Tout ce qui est inclus dans la Navette de Démarrage",
            },
        ],
        featured: false,
        ctaText: "Commencer",
    },
    {
        title: "Explorateur d'Équipe",
        description: "Pour les équipes en croissance avec des besoins de contenu élevés",
        price: "79",
        subtitle: "lancement",
        features: [
            {
                content: "Jusqu'à 200 éléments de contenu par lancement",
            },
            {
                content: "Tableau de bord de contrôle de mission personnalisable",
            },
            {
                content: "Livraison ultra-rapide",
            },
            {
                content: "Analyses avancées et rapports",
            },
            {
                content: "Support dédié",
            },
            {
                content: "Intégrations avancées",
            },
        ],
        additionalFeatures: [
            {
                content: "Tout ce qui est inclus dans la Navette de Démarrage",
            },
            {
                content: "Tout ce qui est inclus dans la Fusée Pro",
            },
        ],
        featured: true,
        ctaText: "Commencer",
    },
    {
        title: "Navette Entreprise",
        description: "Solutions personnalisées pour les charges utiles importantes et les lancements fréquents",
        price: "Contactez-nous",
        subtitle: "lancement",
        features: [
            {
                content: "Éléments de contenu illimités par lancement",
            },
            {
                content: "Tableau de bord de contrôle de mission personnalisable",
            },
            {
                content: "Livraison ultra-rapide",
            },
            {
                content: "Analyses complètes et rapports",
            },
            {
                content: "Équipe de support dédiée",
            },
            {
                content: "Intégrations et solutions personnalisées",
            },
        ],
        additionalFeatures: [
            {
                content: "Tout ce qui est inclus dans la Navette de Démarrage",
            },
            {
                content: "Tout ce qui est inclus dans la Fusée Pro",
            },
            {
                content: "Tout ce qui est inclus dans l'Explorateur d'Équipe",
            },
        ],
        featured: false,
        exception: true,
        ctaText: "Contactez-nous",
    }
];

const getPlans = (locale: Locale) => {
    return locale === "fr" ? frenchPlans : englishPlans;
};

export default getPlans;