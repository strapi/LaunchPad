import { createFileRoute } from '@tanstack/react-router';

import { AmbientColor } from '@/components/decorations/ambient-color';
import { Register } from '@/components/register';

export const Route = createFileRoute('/$locale/sign-up')({
  head: () => ({
    meta: [
      { title: 'Sign up — LaunchPad' },
      { name: 'description', content: 'Sign up for LaunchPad' },
    ],
  }),
  component: SignUpRoute,
});

function SignUpRoute() {
  const { locale } = Route.useParams();
  return (
    <div className="relative overflow-hidden">
      <AmbientColor />
      <Register locale={locale} />
    </div>
  );
}
