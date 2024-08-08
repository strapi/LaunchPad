import { Locale } from "@/config";

const englishFAQs = [
  {
    question: "What is LaunchPad",
    answer:
      "LaunchPad is a content delivery solution that uses advanced technology to send your web content into orbit, ensuring fast and reliable delivery to your audience.",
  },
  {
    question: "How do I get started with LaunchPad?",
    answer:
      "Getting started is easy! Simply sign up for an account, choose your plan, buy some additional features or not, prepare your content, and launch it using our intuitive mission control dashboard.",
  },
  {
    question: "What are the different pricing plans available?",
    answer:
      "We offer four pricing plans: Starter Shuttle ($100/launch), Pro Rocket ($3,000/launch), Team Explorer ($15,000/launch), and Enterprise Shuttle (Contact us for pricing). Each plan comes with its own set of features to suit different needs.",
  },
  {
    question: "What happens if I exceed the content item limit for my plan?",
    answer:
      "If you exceed the content item limit for your plan, you will need to upgrade to a higher plan or purchase additional launches to accommodate your content.",
  },
  {
    question: "Is there a way to track the performance of my launched content?",
    answer:
      "Yes, all our plans include analytics features that allow you to track the performance of your launched content. Higher-tier plans offer more advanced analytics and reporting options.",
  },
  {
    question: "What support options are available if I encounter issues?",
    answer:
      "We offer priority support for Pro Rocket, Team Explorer, and Enterprise Shuttle plans. For other plans, standard support is available via our help center and email.",
  },
  {
    question: "Can I integrate LaunchPad with other tools and platforms?",
    answer:
      "Yes, LaunchPad supports integration with various third-party tools and platforms. Our Enterprise Integration Kit offers customizable integration options for complex needs.",
  },
];


const frenchFAQs = [
  {
    question: "Qu'est-ce que LaunchPad ?",
    answer:
      "LaunchPad est une solution de diffusion de contenu qui utilise une technologie avancée pour envoyer votre contenu web en orbite, assurant une livraison rapide et fiable à votre audience.",
  },
  {
    question: "Comment puis-je commencer avec LaunchPad ?",
    answer:
      "Commencer est facile ! Il suffit de créer un compte, de choisir votre plan, d'acheter des fonctionnalités supplémentaires ou non, de préparer votre contenu et de le lancer en utilisant notre tableau de bord de contrôle de mission intuitif.",
  },
  {
    question: "Quels sont les différents plans tarifaires disponibles ?",
    answer:
      "Nous proposons quatre plans tarifaires : Navette de Démarrage (100€/lancement), Fusée Pro (3 000€/lancement), Explorateur d'Équipe (15 000€/lancement) et Navette Entreprise (Contactez-nous pour les tarifs). Chaque plan est accompagné de ses propres fonctionnalités pour répondre à différents besoins.",
  },
  {
    question: "Que se passe-t-il si je dépasse la limite d'éléments de contenu de mon plan ?",
    answer:
      "Si vous dépassez la limite d'éléments de contenu de votre plan, vous devrez passer à un plan supérieur ou acheter des lancements supplémentaires pour accueillir votre contenu.",
  },
  {
    question: "Existe-t-il un moyen de suivre les performances de mon contenu lancé ?",
    answer:
      "Oui, tous nos plans incluent des fonctionnalités d'analyse qui vous permettent de suivre les performances de votre contenu lancé. Les plans de niveau supérieur offrent des options d'analyse et de reporting plus avancées.",
  },
  {
    question: "Quelles options de support sont disponibles si je rencontre des problèmes ?",
    answer:
      "Nous offrons un support prioritaire pour les plans Fusée Pro, Explorateur d'Équipe et Navette Entreprise. Pour les autres plans, un support standard est disponible via notre centre d'aide et par e-mail.",
  },
  {
    question: "Puis-je intégrer LaunchPad à d'autres outils et plateformes ?",
    answer:
      "Oui, LaunchPad prend en charge l'intégration avec divers outils et plateformes tiers. Notre Kit d'Intégration Entreprise offre des options d'intégration personnalisables pour des besoins complexes.",
  },
];

const getFAQs = (locale: Locale) => {
  return locale === "en" ? englishFAQs : frenchFAQs;
};

export default getFAQs;