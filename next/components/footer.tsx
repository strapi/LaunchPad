import { Link } from 'next-view-transitions';
import React from 'react';
import { IconBrandLinkedin, IconBrandYoutube, IconBrandTwitter, IconMail } from '@tabler/icons-react';

import { Logo } from '@/components/logo';

const socialLinks = [
  {
    name: 'LinkedIn',
    href: 'https://www.linkedin.com/in/peter-sung-647b208/',
    icon: IconBrandLinkedin
  },
  {
    name: 'YouTube',
    href: 'https://www.youtube.com/@drpetersung',
    icon: IconBrandYoutube
  },
  {
    name: 'Twitter',
    href: 'https://twitter.com/drpetersung',
    icon: IconBrandTwitter
  },
  {
    name: 'Email',
    href: 'mailto:peter@securebase.cc',
    icon: IconMail
  },
];

export const Footer = async ({
  data,
  locale,
}: {
  data: any;
  locale: string;
}) => {
  return (
    <div className="relative">
      <div className="border-t border-neutral-200 dark:border-neutral-900 px-8 pt-16 pb-12 relative bg-white dark:bg-primary">
        <div className="max-w-7xl mx-auto">
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
            {/* Brand Column */}
            <div className="md:col-span-2">
              <div className="mb-4">
                {data?.logo?.image ? (
                  <Logo image={data?.logo?.image} />
                ) : (
                  <span className="text-2xl font-bold text-cyan-600 dark:text-cyan-400">SecureBase</span>
                )}
              </div>
              <p className="text-neutral-600 dark:text-neutral-400 max-w-md mb-6">
                {data?.description || 'Empowering leaders with psychological safety, strategic clarity, and high-performance coaching.'}
              </p>

              {/* Social Icons */}
              <div className="flex gap-4">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-600 dark:text-neutral-400 hover:bg-cyan-500 hover:text-white transition-all duration-300"
                    aria-label={social.name}
                  >
                    <social.icon size={20} />
                  </a>
                ))}
              </div>
            </div>

            {/* Links Columns */}
            <div>
              <h4 className="font-semibold text-neutral-900 dark:text-white mb-4">Quick Links</h4>
              <div className="space-y-3">
                <FooterLink href={`/${locale}/about`} label="About" />
                <FooterLink href={`/${locale}/coaching`} label="Coaching" />
                <FooterLink href={`/${locale}/contact`} label="Contact" />
                <FooterLink href={`/${locale}/blog`} label="Blog" />
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-neutral-900 dark:text-white mb-4">Resources</h4>
              <div className="space-y-3">
                <FooterLink href="/dashboard" label="Dashboard" />
                <FooterLink href="https://www.linkedin.com/in/peter-sung-647b208/" label="LinkedIn" external />
                <FooterLink href="https://www.youtube.com/@drpetersung" label="YouTube" external />
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-12 pt-8 border-t border-neutral-200 dark:border-neutral-800">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-sm text-neutral-500 dark:text-neutral-500">
                {data?.copyright || `© ${new Date().getFullYear()} Dr. Peter Sung. All rights reserved.`}
              </p>
              <div className="flex gap-6 text-sm text-neutral-500 dark:text-neutral-500">
                <a href={`/${locale}/privacy`} className="hover:text-cyan-500 transition-colors">Privacy Policy</a>
                <a href={`/${locale}/terms`} className="hover:text-cyan-500 transition-colors">Terms of Service</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const FooterLink = ({ href, label, external }: { href: string; label: string; external?: boolean }) => (
  external ? (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="block text-neutral-600 dark:text-neutral-400 hover:text-cyan-500 dark:hover:text-cyan-400 transition-colors text-sm"
    >
      {label}
    </a>
  ) : (
    <Link
      href={href}
      className="block text-neutral-600 dark:text-neutral-400 hover:text-cyan-500 dark:hover:text-cyan-400 transition-colors text-sm"
    >
      {label}
    </Link>
  )
);
