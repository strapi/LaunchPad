import { createFileRoute } from '@tanstack/react-router';

import { AmbientColor } from '@/components/decorations/ambient-color';
import { SignIn } from '@/components/sign-in';

export const Route = createFileRoute('/$locale/sign-in')({
  head: () => ({
    meta: [
      { title: 'Sign in — LaunchPad' },
      { name: 'description', content: 'Sign in to LaunchPad' },
    ],
  }),
  component: SignInRoute,
});

function SignInRoute() {
  const { locale } = Route.useParams();
  return (
    <div className="relative overflow-hidden">
      <AmbientColor />
      <SignIn locale={locale} />
    </div>
  );
}
