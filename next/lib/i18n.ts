import type { Locale } from '@/i18n.config';

// UI chrome only. Everything a customer reads as content comes from Strapi.
const t = {
  en: {
    products: 'Products', news: 'News', press: 'Press releases', readMore: 'Read more', back: 'Back', from: 'from', included: 'Included', notIncluded: 'Not included',
    documents: 'Documents', download: 'Download PDF', faq: 'Questions', rate: 'Representative rate', allProducts: 'All products', draft: 'Draft mode', exitDraft: 'Exit draft',
    demo: 'Demo site. Placeholder content.', quoteTitle: 'Your price in five minutes', quoteHint: 'Pick a cover to start. No commitment.', quoteButton: 'Start my quote',
    claims247: 'Claims line, 24/7', talkToAgent: 'Talk to an agent', ourCover: 'Our cover', ourCoverIntro: 'One page per product. One price explanation. One set of documents per country.',
    latestNews: 'Latest news', allNews: 'All news', pressKit: 'For journalists', whatIsCovered: 'What is covered', priceAndTerms: 'Price and terms', market: 'Market',
    validFrom: 'Valid from', outOfScope: 'This part of the site is not part of the demo.', outOfScopeHint: 'The quote funnel, customer account and careers portal are separate applications.',
    backHome: 'Back to the home page', followUs: 'Meridian in your market', legal: 'Legal', step: 'Step', inThisArticle: 'Published', share: 'Share', relatedProducts: 'Related cover',
    mutualSince: 'A mutual since', noShareholders: 'No shareholders', category: { motor: 'Motor', home: 'Home', health: 'Health', life: 'Life', savings: 'Savings', travel: 'Travel', pet: 'Pet', business: 'Business' },
  },
  fr: {
    products: 'Produits', news: 'Actualités', press: 'Communiqués', readMore: 'Lire la suite', back: 'Retour', from: 'à partir de', included: 'Inclus', notIncluded: 'Non inclus',
    documents: 'Documents', download: 'Télécharger le PDF', faq: 'Questions', rate: 'Taux représentatif', allProducts: 'Tous les produits', draft: 'Mode brouillon', exitDraft: 'Quitter',
    demo: 'Site de démonstration. Contenu fictif.', quoteTitle: 'Votre tarif en cinq minutes', quoteHint: 'Choisissez une couverture pour commencer. Sans engagement.', quoteButton: 'Obtenir mon devis',
    claims247: 'Sinistres, 24h/24', talkToAgent: 'Parler à un conseiller', ourCover: 'Nos couvertures', ourCoverIntro: 'Une page par produit. Une explication du prix. Des documents par pays.',
    latestNews: 'Dernières actualités', allNews: 'Toutes les actualités', pressKit: 'Espace presse', whatIsCovered: 'Ce qui est couvert', priceAndTerms: 'Prix et conditions', market: 'Marché',
    validFrom: 'Valable à partir du', outOfScope: 'Cette partie du site ne fait pas partie de la démonstration.', outOfScopeHint: 'Le parcours de devis, l’espace client et le portail carrières sont des applications séparées.',
    backHome: 'Retour à l’accueil', followUs: 'Meridian dans votre pays', legal: 'Mentions légales', step: 'Étape', inThisArticle: 'Publié le', share: 'Partager', relatedProducts: 'Couvertures liées',
    mutualSince: 'Une mutuelle depuis', noShareholders: 'Sans actionnaires', category: { motor: 'Auto', home: 'Habitation', health: 'Santé', life: 'Prévoyance', savings: 'Épargne', travel: 'Voyage', pet: 'Animaux', business: 'Pro' },
  },
  de: {
    products: 'Produkte', news: 'Aktuelles', press: 'Pressemitteilungen', readMore: 'Weiterlesen', back: 'Zurück', from: 'ab', included: 'Enthalten', notIncluded: 'Nicht enthalten',
    documents: 'Dokumente', download: 'PDF herunterladen', faq: 'Fragen', rate: 'Repräsentativer Zins', allProducts: 'Alle Produkte', draft: 'Entwurfsmodus', exitDraft: 'Verlassen',
    demo: 'Demo-Website. Platzhalterinhalte.', quoteTitle: 'Ihr Preis in fünf Minuten', quoteHint: 'Wählen Sie einen Schutz. Unverbindlich.', quoteButton: 'Angebot starten',
    claims247: 'Schadenhotline, rund um die Uhr', talkToAgent: 'Mit einem Berater sprechen', ourCover: 'Unser Schutz', ourCoverIntro: 'Eine Seite pro Produkt. Eine Preiserklärung. Dokumente pro Land.',
    latestNews: 'Neuigkeiten', allNews: 'Alle Neuigkeiten', pressKit: 'Für Journalisten', whatIsCovered: 'Was versichert ist', priceAndTerms: 'Preis und Bedingungen', market: 'Markt',
    validFrom: 'Gültig ab', outOfScope: 'Dieser Teil der Website gehört nicht zur Demo.', outOfScopeHint: 'Angebotsstrecke, Kundenkonto und Karriereportal sind eigene Anwendungen.',
    backHome: 'Zur Startseite', followUs: 'Meridian in Ihrem Land', legal: 'Rechtliches', step: 'Schritt', inThisArticle: 'Veröffentlicht am', share: 'Teilen', relatedProducts: 'Passender Schutz',
    mutualSince: 'Ein Verein auf Gegenseitigkeit seit', noShareholders: 'Keine Aktionäre', category: { motor: 'Kfz', home: 'Wohnen', health: 'Gesundheit', life: 'Leben', savings: 'Sparen', travel: 'Reise', pet: 'Tiere', business: 'Gewerbe' },
  },
  it: {
    products: 'Prodotti', news: 'Notizie', press: 'Comunicati stampa', readMore: 'Leggi tutto', back: 'Indietro', from: 'da', included: 'Incluso', notIncluded: 'Non incluso',
    documents: 'Documenti', download: 'Scarica il PDF', faq: 'Domande', rate: 'Tasso rappresentativo', allProducts: 'Tutti i prodotti', draft: 'Modalità bozza', exitDraft: 'Esci',
    demo: 'Sito dimostrativo. Contenuti fittizi.', quoteTitle: 'Il tuo prezzo in cinque minuti', quoteHint: 'Scegli una copertura per iniziare. Senza impegno.', quoteButton: 'Calcola il preventivo',
    claims247: 'Sinistri, 24 ore su 24', talkToAgent: 'Parla con un agente', ourCover: 'Le nostre coperture', ourCoverIntro: 'Una pagina per prodotto. Una spiegazione del prezzo. I documenti per il tuo paese.',
    latestNews: 'Ultime notizie', allNews: 'Tutte le notizie', pressKit: 'Per i giornalisti', whatIsCovered: 'Cosa è coperto', priceAndTerms: 'Prezzo e condizioni', market: 'Mercato',
    validFrom: 'Valido dal', outOfScope: 'Questa parte del sito non fa parte della demo.', outOfScopeHint: 'Il percorso di preventivo, l’area clienti e il portale carriere sono applicazioni separate.',
    backHome: 'Torna alla home', followUs: 'Meridian nel tuo paese', legal: 'Note legali', step: 'Passo', inThisArticle: 'Pubblicato il', share: 'Condividi', relatedProducts: 'Coperture collegate',
    mutualSince: 'Una mutua dal', noShareholders: 'Nessun azionista', category: { motor: 'Auto', home: 'Casa', health: 'Salute', life: 'Vita', savings: 'Risparmio', travel: 'Viaggi', pet: 'Animali', business: 'Imprese' },
  },
} as const;

export type Dict = (typeof t)['en'];
export const dict = (locale: Locale): Dict => (t[locale] ?? t.en) as Dict;

export function formatDate(iso: string | undefined, locale: Locale) {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'long', year: 'numeric' }).format(d);
}
