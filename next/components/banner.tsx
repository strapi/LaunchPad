import Link from 'next/link';

export function Banner() {
  return (
    <div className="fixed top-0 inset-x-0 h-[3.25rem] z-[60] bg-neutral-900 border-b-2 border-neutral-800 flex items-center justify-center">
      <div className="flex w-full h-full items-center justify-center bg-neutral-800 rounded shrink shadow-[0px_-1px_0px_0px_var(--neutral-700)] text-sm font-medium text-neutral-200 px-4">
        <span className="truncate">
          You&apos;re exploring the Strapi Launchpad demo &middot;{' '}
          <Link
            href="https://github.com/strapi/LaunchPad"
            target="_blank"
            className="text-white hover:text-neutral-300 transition-colors underline underline-offset-4 decoration-neutral-500"
          >
            View the code on GitHub, stars, PRs, and issues are always welcome
          </Link>
        </span>
      </div>
    </div>
  );
}
