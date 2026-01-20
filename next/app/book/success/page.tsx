import { Suspense } from 'react';
import { Metadata } from 'next';
import { SuccessContent } from './SuccessContent';

export const metadata: Metadata = {
  title: 'Order Confirmed - The Secure Base',
  description: 'Your pre-order has been confirmed.',
};

export default function BookSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <SuccessContent />
    </Suspense>
  );
}
