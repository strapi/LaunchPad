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
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      {/* Hero Section */}
      <section className="relative py-24 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-primary font-medium mb-4 tracking-wide uppercase text-sm">
              Contact
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-foreground mb-6 leading-tight">
              Get in Touch
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              Send us a note, and we&apos;ll respond within 24 hours to schedule a 30-minute discovery call.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-background-secondary border-y border-border transition-colors">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-16">
              {/* Contact Info */}
              <div className="lg:col-span-2 space-y-8">
                <div>
                  <h2 className="text-2xl font-display font-bold text-foreground mb-4">
                    Let&apos;s Connect
                  </h2>
                  <p className="text-muted-foreground">
                    Whether you&apos;re looking for executive coaching, organizational consulting, or a keynote speaker, I look forward to hearing from you.
                  </p>
                </div>

                <div className="space-y-6">
                  {contactInfo.map((item, index) => (
                    <div key={index} className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <item.icon className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">{item.label}</p>
                        {item.href ? (
                          <a
                            href={item.href}
                            className="text-foreground hover:text-primary transition-colors font-medium"
                          >
                            {item.value}
                          </a>
                        ) : (
                          <p className="text-foreground font-medium">{item.value}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Quote */}
                <div className="pt-8 border-t border-border">
                  <blockquote className="text-foreground/80 italic font-serif">
                    &ldquo;The key is to get started, by doing the first thing, however small.&rdquo;
                  </blockquote>
                  <p className="text-primary text-sm mt-2">— Dr. Peter Sung</p>
                </div>
              </div>

              {/* Contact Form */}
              <div className="lg:col-span-3" id="form">
                <div className="bg-card border border-border rounded-2xl p-8 md:p-10 shadow-sm transition-colors">
                  {isSubmitted ? (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
                        <IconCheck className="w-8 h-8 text-green-500" />
                      </div>
                      <h3 className="text-2xl font-bold text-foreground mb-2">
                        Message Sent!
                      </h3>
                      <p className="text-muted-foreground">
                        Thank you for reaching out. We&apos;ll be in touch within 24 hours.
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      {/* Error Alert */}
                      {error && (
                        <div className="flex items-center gap-3 p-4 bg-destructive/10 border border-destructive/20 rounded-xl text-destructive">
                          <IconAlertCircle className="w-5 h-5 flex-shrink-0" />
                          <p className="text-sm">{error}</p>
                        </div>
                      )}

                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                          Name
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formState.name}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 bg-background border border-input rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                          placeholder="Your name"
                        />
                      </div>

                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                          Email
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formState.email}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 bg-background border border-input rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                          placeholder="your@email.com"
                        />
                      </div>

                      <div>
                        <label htmlFor="subject" className="block text-sm font-medium text-foreground mb-2">
                          Subject
                        </label>
                        <select
                          id="subject"
                          name="subject"
                          value={formState.subject}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 bg-background border border-input rounded-xl text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
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
                        <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
                          Message
                        </label>
                        <textarea
                          id="message"
                          name="message"
                          value={formState.message}
                          onChange={handleChange}
                          required
                          rows={5}
                          className="w-full px-4 py-3 bg-background border border-input rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors resize-none"
                          placeholder="Tell us about your goals and how we can help..."
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold text-primary-foreground bg-primary hover:bg-primary/90 disabled:bg-primary/50 disabled:cursor-not-allowed rounded-xl transition-all duration-200 hover:scale-[1.01] hover:shadow-lg hover:shadow-primary/25 active:scale-[0.99]"
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
      <section className="py-24 bg-background transition-colors">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-6">
              Available Worldwide
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Dr. Sung works with leaders and organizations globally, offering both in-person and virtual coaching sessions.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {['Executive Coaching', 'Team Workshops', 'Keynote Speaking'].map((service, index) => (
                <div
                  key={index}
                  className="bg-card border border-border rounded-xl p-6 hover:border-primary/30 transition-all hover:shadow-lg"
                >
                  <p className="text-foreground font-medium">{service}</p>
                  <p className="text-muted-foreground text-sm mt-1">Virtual & In-Person</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
