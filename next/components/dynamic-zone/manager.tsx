'use client';

import dynamic from 'next/dynamic';
import React from 'react';

interface DynamicZoneComponent {
  __component: string;
  id: number;
  documentId?: string;
  [key: string]: unknown;
}

interface Props {
  dynamicZone: DynamicZoneComponent[];
  locale: string;
}

const componentMapping: { [key: string]: any } = {
  'dynamic-zone.hero': dynamic(() => import('./hero').then((mod) => mod.Hero)),
  'dynamic-zone.features': dynamic(() =>
    import('./features').then((mod) => mod.Features)
  ),
  'sections.section-service': dynamic(() =>
    import('./services').then((mod) => mod.Services)
  ),
  'sections.section-projet-home': dynamic(() =>
    import('./section-projet-home').then((mod) => mod.SectionProjetHome)
  ),
  'sections.notre-equipe-home': dynamic(() =>
    import('./notre-equipe-home').then((mod) => mod.NotreEquipeHome)
  ),
  'sections.service-card': dynamic(() =>
    import('./service-card').then((mod) => mod.ServiceCard)
  ),
  'sections.technologies-home': dynamic(() =>
    import('./sections/technologies-home').then((mod) => mod.TechnologiesHome)
  ),
  'sections.a-propos-de-nous': dynamic(() =>
    import('./sections/section-apropos-de-nous').then(
      (mod) => mod.SectionAProposDeNous
    )
  ),
  'sections.nos-valeurs-a-propos': dynamic(() =>
    import('./sections/nos-valeurs-a-propos').then(
      (mod) => mod.NosValeursAPropros
    )
  ),

  'sections.section-title-content-image': dynamic(() =>
    import('./sections/section-title-content-image').then(
      (mod) => mod.SectionTitleContentImage
    )
  ),
  'sections.section-image': dynamic(() =>
    import('./sections/section-image').then((mod) => mod.SectionImage)
  ),
  'sections.who-are-we': dynamic(() =>
    import('./who-are-we').then((mod) => mod.Who_are_we)
  ),
  'sections.our-vision': dynamic(() =>
    import('./our-vision-section').then((mod) => mod.OurVisionSection)
  ),
  'sections.team-first-section': dynamic(() =>
    import('./team-first-section').then((mod) => mod.TeamFirstSection)
  ),
  'sections.our-trust': dynamic(() =>
    import('./our-trust').then((mod) => mod.OurTrust)
  ),
  'sections.our-values': dynamic(() =>
    import('./our-values').then((mod) => mod.OurValues)
  ),
  'sections.team-members': dynamic(() =>
    import('./team-member').then((mod) => mod.ThemeMember)
  ),
  'sections.team-members-apropos': dynamic(() =>
    import('./sections/team-members-apropos').then(
      (mod) => mod.TeamMembersAPropos
    )
  ),
  'sections.client-satified': dynamic(() =>
    import('./client-satified-section').then(
      (mod) => mod.ClientSatisfiedSection
    )
  ),
  'sections.trusted-client': dynamic(() =>
    import('./trused-client').then((mod) => mod.TrusedClient)
  ),
  'sections.cas-etude': dynamic(() =>
    import('./cas-etude').then((mod) => mod.CasEtude)
  ),
  'items.images-grid': dynamic(() =>
    import('./images-grid').then((mod) => mod.ImagesGrid)
  ),
  'items.cas-etude-header': dynamic(() =>
    import('./cas-etude-header').then((mod) => mod.CasUtudeHeader)
  ),
  'dynamic-zone.see-realization': dynamic(() =>
    import('./see-realization').then((mod) => mod.SeeRealization)
  ),
  'sections.carousel-avis-client': dynamic(() =>
    import('./carousel-avis-client').then((mod) => mod.CarouselAvisClient)
  ),
  'sections.avis-clients': dynamic(() =>
    import('./avis-clients').then((mod) => mod.AvisClients)
  ),
  'sections.our-services-have': dynamic(() =>
    import('./our-services-have').then((mod) => mod.OurServicesHave)
  ),
  'sections.booste-activity': dynamic(() =>
    import('./expertise-section').then((mod) => mod.ExpertiseSection)
  ),
  'dynamic-zone.testimonials': dynamic(() =>
    import('./testimonials').then((mod) => mod.Testimonials)
  ),
  'dynamic-zone.how-it-works': dynamic(() =>
    import('./how-it-works').then((mod) => mod.HowItWorks)
  ),
  'dynamic-zone.brands': dynamic(() =>
    import('./brands').then((mod) => mod.Brands)
  ),
  'dynamic-zone.pricing': dynamic(() =>
    import('./pricing').then((mod) => mod.Pricing)
  ),
  'dynamic-zone.launches': dynamic(() =>
    import('./launches').then((mod) => mod.Launches)
  ),
  'dynamic-zone.cta': dynamic(() => import('./cta').then((mod) => mod.CTA)),
  'dynamic-zone.form-next-to-section': dynamic(() =>
    import('./form-next-to-section').then((mod) => mod.FormNextToSection)
  ),
  'dynamic-zone.faq': dynamic(() => import('./faq').then((mod) => mod.FAQ)),
  'dynamic-zone.related-products': dynamic(() =>
    import('./related-products').then((mod) => mod.RelatedProducts)
  ),
  'dynamic-zone.related-articles': dynamic(() =>
    import('./related-articles').then((mod) => mod.RelatedArticles)
  ),
  'form.contact-form': dynamic(() =>
    import('./form/contact-form').then((mod) => mod.ContactForm)
  ),
};

const DynamicZoneManager: React.FC<Props> = ({ dynamicZone, locale }) => {
  return (
    <div>
      {dynamicZone.map((componentData, index) => {
        const Component = componentMapping[componentData.__component];
        if (!Component) {
          console.warn(`No component found for: ${componentData.__component}`);
          return null;
        }
        return (
          <Component
            key={`${componentData.__component}-${componentData.id}-${index}`}
            {...componentData}
            locale={locale}
          />
        );
      })}
    </div>
  );
};

export default DynamicZoneManager;
