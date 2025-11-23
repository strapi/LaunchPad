'use client';

import { useState } from 'react';
import { IconMail, IconPhone, IconMapPin, IconSend, IconCheck, IconAlertCircle } from '@tabler/icons-react';

// Contact info items
const contactInfo = [
  {
    icon: IconMail,
    label: 'Email',
    value: 'hello@securebase.cc',
    href: 'mailto:hello@securebase.cc',
  },
  {
    icon: IconPhone,
    label: 'Phone',
    value: 'Schedule a call',
    href: '#form',
  },
  {
    icon: IconMapPin,
    label: 'Location',
    value: 'Available Worldwide',
    href: null,
  },
];

export default function ContactPage() {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formState),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send message');
      }

      setIsSubmitted(true);

      // Reset form after showing success
      setTimeout(() => {
        setFormState({ name: '', email: '', subject: '', message: '' });
        setIsSubmitted(false);
      }, 5000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormState((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    // Clear error when user starts typing
    if (error) setError(null);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-charcoal transition-colors">
      {/* Hero Section */}
      <section className="relative py-24 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 dark:from-cyan-900/10 via-transparent to-transparent" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-cyan-600 dark:text-cyan-400 font-medium mb-4 tracking-wide uppercase text-sm">
              Contact
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-neutral-900 dark:text-white mb-6 leading-tight">
              Get in Touch
            </h1>
            <p className="text-xl text-neutral-600 dark:text-gray-300 leading-relaxed max-w-2xl mx-auto">
              Send us a note, and we&apos;ll respond within 24 hours to schedule a 30-minute discovery call.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-neutral-50 dark:bg-zinc-900/30 border-y border-neutral-200 dark:border-white/5 transition-colors">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-16">
              {/* Contact Info */}
              <div className="lg:col-span-2 space-y-8">
                <div>
                  <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-4">
                    Let&apos;s Connect
                  </h2>
                  <p className="text-neutral-600 dark:text-gray-400">
                    Whether you&apos;re looking for executive coaching, organizational consulting, or a keynote speaker, I look forward to hearing from you.
                  </p>
                </div>

                <div className="space-y-6">
                  {contactInfo.map((item, index) => (
                    <div key={index} className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center flex-shrink-0">
                        <item.icon className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
                      </div>
                      <div>
                        <p className="text-sm text-neutral-500 dark:text-gray-400 mb-1">{item.label}</p>
                        {item.href ? (
                          <a
                            href={item.href}
                            className="text-neutral-900 dark:text-white hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors font-medium"
                          >
                            {item.value}
                          </a>
                        ) : (
                          <p className="text-neutral-900 dark:text-white font-medium">{item.value}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Quote */}
                <div className="pt-8 border-t border-neutral-200 dark:border-white/10">
                  <blockquote className="text-neutral-600 dark:text-gray-300 italic">
                    &ldquo;The key is to get started, by doing the first thing, however small.&rdquo;
                  </blockquote>
                  <p className="text-cyan-600 dark:text-cyan-400 text-sm mt-2">— Dr. Peter Sung</p>
                </div>
              </div>

              {/* Contact Form */}
              <div className="lg:col-span-3" id="form">
                <div className="bg-white dark:bg-zinc-900/50 border border-neutral-200 dark:border-white/5 rounded-2xl p-8 md:p-10 shadow-sm dark:shadow-none transition-colors">
                  {isSubmitted ? (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
                        <IconCheck className="w-8 h-8 text-green-500" />
                      </div>
                      <h3 className="text-2xl font-bold text-neutral-900 dark:text-white mb-2">
                        Message Sent!
                      </h3>
                      <p className="text-neutral-600 dark:text-gray-400">
                        Thank you for reaching out. We&apos;ll be in touch within 24 hours.
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      {/* Error Alert */}
                      {error && (
                        <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-600 dark:text-red-400">
                          <IconAlertCircle className="w-5 h-5 flex-shrink-0" />
                          <p className="text-sm">{error}</p>
                        </div>
                      )}

                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-neutral-700 dark:text-gray-300 mb-2">
                          Name
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formState.name}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 bg-neutral-50 dark:bg-black/40 border border-neutral-300 dark:border-white/10 rounded-xl text-neutral-900 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-gray-500 focus:outline-none focus:border-cyan-500 dark:focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-colors"
                          placeholder="Your name"
                        />
                      </div>

                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-neutral-700 dark:text-gray-300 mb-2">
                          Email
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formState.email}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 bg-neutral-50 dark:bg-black/40 border border-neutral-300 dark:border-white/10 rounded-xl text-neutral-900 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-gray-500 focus:outline-none focus:border-cyan-500 dark:focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-colors"
                          placeholder="your@email.com"
                        />
                      </div>

                      <div>
                        <label htmlFor="subject" className="block text-sm font-medium text-neutral-700 dark:text-gray-300 mb-2">
                          Subject
                        </label>
                        <select
                          id="subject"
                          name="subject"
                          value={formState.subject}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 bg-neutral-50 dark:bg-black/40 border border-neutral-300 dark:border-white/10 rounded-xl text-neutral-900 dark:text-white focus:outline-none focus:border-cyan-500 dark:focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-colors"
                        >
                          <option value="">Select a topic...</option>
                          <option value="Executive Coaching">Executive Coaching</option>
                          <option value="Team Workshop">Team Workshop</option>
                          <option value="Keynote Speaking">Keynote Speaking</option>
                          <option value="Organizational Consulting">Organizational Consulting</option>
                          <option value="General Inquiry">General Inquiry</option>
                        </select>
                      </div>

                      <div>
                        <label htmlFor="message" className="block text-sm font-medium text-neutral-700 dark:text-gray-300 mb-2">
                          Message
                        </label>
                        <textarea
                          id="message"
                          name="message"
                          value={formState.message}
                          onChange={handleChange}
                          required
                          rows={5}
                          className="w-full px-4 py-3 bg-neutral-50 dark:bg-black/40 border border-neutral-300 dark:border-white/10 rounded-xl text-neutral-900 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-gray-500 focus:outline-none focus:border-cyan-500 dark:focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-colors resize-none"
                          placeholder="Tell us about your goals and how we can help..."
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold text-white dark:text-black bg-cyan-600 dark:bg-cyan-400 hover:bg-cyan-500 dark:hover:bg-cyan-300 disabled:bg-cyan-400/50 disabled:cursor-not-allowed rounded-xl transition-all duration-200 hover:scale-[1.01] hover:shadow-lg hover:shadow-cyan-500/25 active:scale-[0.99]"
                      >
                        {isSubmitting ? (
                          <>
                            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                                fill="none"
                              />
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              />
                            </svg>
                            Sending...
                          </>
                        ) : (
                          <>
                            <IconSend className="w-5 h-5" />
                            Send Message
                          </>
                        )}
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-24 bg-white dark:bg-charcoal transition-colors">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-white mb-6">
              Available Worldwide
            </h2>
            <p className="text-xl text-neutral-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
              Dr. Sung works with leaders and organizations globally, offering both in-person and virtual coaching sessions.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {['Executive Coaching', 'Team Workshops', 'Keynote Speaking'].map((service, index) => (
                <div
                  key={index}
                  className="bg-neutral-50 dark:bg-zinc-900/50 border border-neutral-200 dark:border-white/5 rounded-xl p-6 hover:border-cyan-500/30 transition-all hover:shadow-lg dark:hover:shadow-none"
                >
                  <p className="text-neutral-900 dark:text-white font-medium">{service}</p>
                  <p className="text-neutral-500 dark:text-gray-400 text-sm mt-1">Virtual & In-Person</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
