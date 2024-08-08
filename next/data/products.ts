export type Product = {
  id: number;
  title: string;
  slug: string;
  description: string;
  price: number;
  availableFor: string[];
  features: string[];
  featured?: boolean;
  images: string[];
  categories?: string[];
};

export const products: Product[] = [
  {
    id: 1,
    title: "Content Rocket Booster",
    slug: "content-rocket-booster",
    description:
      "Enhance the speed and performance of your content delivery with our Rocket Booster. Perfect for high-traffic websites needing rapid deployment.",
    price: 1500,
    availableFor: ["Team Explorer", "Enterprise Shuttle"],
    features: [
      "Increases delivery speed by 50%",
      "Optimized for heavy content loads",
      "Easy integration with existing payloads",
    ],
    images: ["/products/rocket-1.png", "/products/rocket-2.png"],
    featured: true,
    categories: ["rocket", "booster"],
  },
  {
    id: 2,
    title: "Payload Manager Pro",
    slug: "payload-manager-pro",
    description:
      "Streamline your content organization and management with the Payload Manager Pro. Ideal for teams handling large volumes of content.",
    price: 2000,
    availableFor: ["Pro Rocket", "Team Explorer", "Enterprise Shuttle"],
    features: [
      "Advanced content organization tools",
      "Collaborative workspace",
      "Real-time updates and tracking",
    ],
    images: ["/products/rocket-3.png", "/products/rocket-4.png"],
    featured: true,
    categories: ["rocket", "booster"],
  },
  {
    id: 3,
    title: "Analytics Insight Pack",
    slug: "analytics-insight-pack",
    description:
      "Gain deeper insights into your content performance with the Analytics Insight Pack. Provides comprehensive analytics and reporting features.",
    price: 750,
    availableFor: [
      "Starter Shuttle",
      "Pro Rocket",
      "Team Explorer",
      "Enterprise Shuttle",
    ],
    features: [
      "Detailed performance reports",
      "Customizable analytics dashboard",
      "Integration with third-party analytics tools",
    ],
    images: ["/products/dashboard.png", "/products/rocket-1.png"],
    featured: true,
    categories: ["dashboard", "analytics"],
  },
  {
    id: 4,
    title: "Mission Control Plus",
    slug: "mission-control-plus",
    description:
      "Upgrade your control center with Mission Control Plus. Offers enhanced monitoring and management features for your content launches.",
    price: 3000,
    availableFor: ["Pro Rocket", "Team Explorer", "Enterprise Shuttle"],
    features: [
      "Advanced monitoring tools",
      "Real-time status updates",
      "Automated alerts and notifications",
    ],
    images: ["/products/rocket-1.png", "/products/rocket-2.png"],
    categories: ["rocket", "control"],
  },
  {
    id: 5,
    title: "Enterprise Integration Kit",
    slug: "enterprise-integration-kit",
    description:
      "Seamlessly integrate LaunchPad with your existing enterprise systems using the Enterprise Integration Kit. Designed for large organizations with complex needs.",
    price: 8000,
    availableFor: ["Enterprise Shuttle"],
    features: [
      "Customizable integration options",
      "Support for multiple platforms and services",
      "Dedicated integration support",
    ],
    images: ["/products/rocket-3.png", "/products/rocket-4.png"],
    categories: ["rocket", "integration"],
  },
];
