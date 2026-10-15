import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-sand p-6 text-center">
      <div>
        <div className="font-display text-7xl font-bold text-navy/20">404</div>
        <p className="mt-4 text-ink-600">Page not found.</p>
        <Link href="/en" className="btn-navy mt-6">Home</Link>
      </div>
    </div>
  );
}
