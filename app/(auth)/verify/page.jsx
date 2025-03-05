"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams?.get("token");
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      return;
    }

    fetch(`/api/verify?token=${token}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.message === "Email verified successfully") {
          setStatus("success");
          router.push("/login");
        } else {
          setStatus("error");
        }
      })
      .catch(() => setStatus("error"));
  }, [token, router]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-black text-white">
      {status === "loading" && <p>Verifying your email...</p>}
      {status === "success" && <p>Email verified! Redirecting to login...</p>}
      {status === "error" && <p>Invalid or expired verification token.</p>}
    </div>
  );
}

export default function VerifyEmail() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyEmailContent />
    </Suspense>
  );
}
