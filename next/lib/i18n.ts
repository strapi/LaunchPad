import type { Locale } from '@/i18n.config';

const t = {
  en: { products: 'Products', news: 'News', press: 'Press', readMore: 'Read more', back: 'Back', from: 'from', included: 'Included', notIncluded: 'Not included', documents: 'Documents', download: 'Download', faq: 'Questions', rate: 'Rate', allProducts: 'All products', draft: 'Draft mode', exitDraft: 'Exit draft', demo: 'Demo site. Placeholder content.' },
  fr: { products: 'Produits', news: 'Actualités', press: 'Presse', readMore: 'Lire la suite', back: 'Retour', from: 'à partir de', included: 'Inclus', notIncluded: 'Non inclus', documents: 'Documents', download: 'Télécharger', faq: 'Questions', rate: 'Taux', allProducts: 'Tous les produits', draft: 'Mode brouillon', exitDraft: 'Quitter', demo: 'Site de démonstration. Contenu fictif.' },
  de: { products: 'Produkte', news: 'Aktuelles', press: 'Presse', readMore: 'Weiterlesen', back: 'Zurück', from: 'ab', included: 'Enthalten', notIncluded: 'Nicht enthalten', documents: 'Dokumente', download: 'Herunterladen', faq: 'Fragen', rate: 'Zins', allProducts: 'Alle Produkte', draft: 'Entwurfsmodus', exitDraft: 'Verlassen', demo: 'Demo-Website. Platzhalterinhalte.' },
  it: { products: 'Prodotti', news: 'Notizie', press: 'Stampa', readMore: 'Leggi tutto', back: 'Indietro', from: 'da', included: 'Incluso', notIncluded: 'Non incluso', documents: 'Documenti', download: 'Scarica', faq: 'Domande', rate: 'Tasso', allProducts: 'Tutti i prodotti', draft: 'Modalità bozza', exitDraft: 'Esci', demo: 'Sito dimostrativo. Contenuti fittizi.' },
} as const;

export const dict = (locale: Locale) => t[locale] ?? t.en;
