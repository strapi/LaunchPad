"use client";

import { Suspense } from "react";
import SignUpContent from "./signup-content";

function SignUpLoading() {
  return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
}

export default function SignUpPage() {
  return (
    <Suspense fallback={<SignUpLoading />}>
      <SignUpContent />
    </Suspense>
  );
}
