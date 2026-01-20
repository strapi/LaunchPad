'use client';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const faqs = [
  {
    question: 'When will the book ship?',
    answer: 'Pre-orders are expected to ship in Spring 2025. You\'ll receive email updates as we approach the launch date. Signed copies may take an additional 1-2 weeks for personalization.',
  },
  {
    question: 'How does the signed copy personalization work?',
    answer: 'When you order a signed copy, you can include a short message (up to 50 characters) that Dr. Sung will incorporate into his inscription. For example, "To Sarah" or "For the leadership team at Acme Corp." If you don\'t provide a message, he\'ll sign with a standard inscription.',
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit cards (Visa, Mastercard, American Express, Discover) through our secure Stripe payment processor. Your card will be charged when your order ships, not when you pre-order.',
  },
  {
    question: 'Can I purchase multiple copies for my team?',
    answer: 'Absolutely! We offer volume discounts for orders of 10+ copies. Contact us at books@securebase.com for bulk pricing and options for team workshops that complement the book.',
  },
  {
    question: 'What formats are included in the eBook?',
    answer: 'The eBook is available in PDF, ePub, and Mobi formats, compatible with Kindle, Apple Books, and all major reading apps. You\'ll receive download links immediately after purchase.',
  },
  {
    question: 'Is international shipping available?',
    answer: 'Yes! We ship worldwide. International orders may take 2-4 weeks and may be subject to customs fees depending on your country. Shipping costs are calculated at checkout.',
  },
  {
    question: 'What are the "digital extras" mentioned?',
    answer: 'Every book purchase includes access to bonus digital content: downloadable worksheets for each chapter, a 60-minute recorded webinar with Dr. Sung, and a leadership assessment tool based on the 3 A\'s framework.',
  },
  {
    question: 'What is your return policy?',
    answer: 'We want you to be completely satisfied. Physical books can be returned within 30 days for a full refund (minus shipping). eBooks are non-refundable due to their digital nature, but we\'re confident you\'ll find value in the content.',
  },
  {
    question: 'Can I upgrade my order later?',
    answer: 'Yes! If you order the regular hardcover or eBook and later want to upgrade to a signed copy or bundle, contact us at books@securebase.com within 30 days of your original order. We\'ll work it out.',
  },
  {
    question: 'Will there be an audiobook version?',
    answer: 'An audiobook narrated by Dr. Sung himself is in production and will be released shortly after the print launch. Pre-order customers will receive an exclusive discount code for the audiobook.',
  },
];

export function BookFAQ() {
  return (
    <section className="py-24 bg-neutral-50 dark:bg-zinc-900">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 dark:text-white mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-neutral-600 dark:text-gray-300">
              Everything you need to know about pre-ordering
            </p>
          </div>

          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index}
                value={`faq-${index}`}
                className="border-2 border-neutral-200 dark:border-neutral-800 rounded-lg px-6 hover:border-cyan-500/50 transition-colors"
              >
                <AccordionTrigger className="hover:no-underline text-left py-6">
                  <span className="font-semibold text-lg text-neutral-900 dark:text-white">
                    {faq.question}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="pt-2 pb-6 text-neutral-600 dark:text-gray-300 leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <div className="mt-12 text-center">
            <p className="text-neutral-600 dark:text-gray-400 mb-4">
              Still have questions?
            </p>
            <a 
              href="mailto:books@securebase.com"
              className="text-cyan-500 hover:text-cyan-400 font-medium transition-colors"
            >
              Contact us at books@securebase.com
            </a>
          </div>

        </div>
      </div>
    </section>
  );
}
