import { Link } from '@tanstack/react-router';

import { Container } from '@/components/container';
import { Heading } from '@/components/elements/heading';
import { Subheading } from '@/components/elements/subheading';

export function NotFound({
  title = 'Page not found',
  message = "The page you're looking for doesn't exist or has moved.",
  locale = 'en',
}: Readonly<{
  title?: string;
  message?: string;
  locale?: string;
}>) {
  return (
    <Container className="min-h-[60vh] flex flex-col items-center justify-center text-center pt-40 pb-20">
      <Heading className="text-4xl md:text-6xl">{title}</Heading>
      <Subheading className="mt-4">{message}</Subheading>
      <div className="mt-8">
        <Link
          to="/$locale"
          params={{ locale }}
          className="text-sm text-white underline hover:text-neutral-300 transition-colors"
        >
          ← Back to home
        </Link>
      </div>
    </Container>
  );
}
