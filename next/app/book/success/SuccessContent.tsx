'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { IconCircleCheck, IconMail, IconBook, IconCalendar } from '@tabler/icons-react';
import Link from 'next/link';

export function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Add analytics tracking here
    if (sessionId) {
      console.log('Order completed:', sessionId);
    }
    setLoading(false);
  }, [sessionId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto mb-4"></div>
          <p className="text-neutral-600 dark:text-gray-400">Confirming your order...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-cyan-50 to-white dark:from-zinc-900 dark:to-charcoal flex items-center justify-center py-12 px-4">
      <div className="max-w-2xl w-full">
        
        {/* Success Icon */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-green-100 dark:bg-green-900/30 mb-6">
            <IconCircleCheck className="w-12 h-12 text-green-600 dark:text-green-400" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 dark:text-white mb-4">
            Order Confirmed!
          </h1>
          <p className="text-xl text-neutral-600 dark:text-gray-300">
            Thank you for pre-ordering <em>The Secure Base</em>
          </p>
        </div>

        {/* What's Next */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-6">
              What happens next?
            </h2>
            
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-cyan-500/10 flex items-center justify-center">
                  <IconMail className="w-6 h-6 text-cyan-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-neutral-900 dark:text-white mb-1">
                    Check your email
                  </h3>
                  <p className="text-neutral-600 dark:text-gray-300">
                    We've sent a confirmation with your order details and receipt. You'll also receive 
                    access to your exclusive digital extras within 24 hours.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-cyan-500/10 flex items-center justify-center">
                  <IconCalendar className="w-6 h-6 text-cyan-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-neutral-900 dark:text-white mb-1">
                    Launch day updates
                  </h3>
                  <p className="text-neutral-600 dark:text-gray-300">
                    We'll keep you posted on the book's progress. Expected shipping: <strong>Spring 2025</strong>. 
                    Signed copies may take an additional 1-2 weeks for personalization.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-cyan-500/10 flex items-center justify-center">
                  <IconBook className="w-6 h-6 text-cyan-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-neutral-900 dark:text-white mb-1">
                    Your book ships
                  </h3>
                  <p className="text-neutral-600 dark:text-gray-300">
                    Once we ship your order, you'll receive a tracking number. Get ready to start your 
                    leadership transformation journey!
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Digital Extras Preview */}
        <Card className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border-2 border-cyan-500/30 mb-8">
          <CardContent className="p-6">
            <h3 className="font-bold text-neutral-900 dark:text-white mb-3">
              🎁 Your Digital Extras
            </h3>
            <ul className="space-y-2 text-sm text-neutral-600 dark:text-gray-300">
              <li>• Downloadable worksheets for all 12 chapters</li>
              <li>• 60-minute recorded webinar with Dr. Sung</li>
              <li>• Leadership assessment tool (The 3 A's framework)</li>
              <li>• Invitation to exclusive launch day Q&A session</li>
            </ul>
            <p className="text-xs text-neutral-500 dark:text-gray-500 mt-4">
              Check your email for access within 24 hours
            </p>
          </CardContent>
        </Card>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/coaching">
            <Button size="lg" className="w-full sm:w-auto">
              Explore Coaching Options
            </Button>
          </Link>
          <Link href="/">
            <Button variant="outline" size="lg" className="w-full sm:w-auto">
              Return to Home
            </Button>
          </Link>
        </div>

        {/* Support */}
        <div className="mt-8 text-center text-sm text-neutral-500 dark:text-gray-500">
          <p>Questions about your order?</p>
          <a 
            href="mailto:books@securebase.com" 
            className="text-cyan-500 hover:text-cyan-400 transition-colors"
          >
            Contact us at books@securebase.com
          </a>
        </div>

      </div>
    </div>
  );
}
