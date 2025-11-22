"use client";

import { Suspense } from "react";
import LoginPageContent from "./login-content";

function LoginLoading() {
  return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginLoading />}>
      <LoginPageContent />
    </Suspense>
  );
}
