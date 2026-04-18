import { AmbientColor } from '@/components/decorations/ambient-color';
import { SignInForm } from '@/components/sign-in-form';

export default function SignInPage() {
  return (
    <div className="relative overflow-hidden">
      <AmbientColor />
      <SignInForm />
    </div>
  );
}
