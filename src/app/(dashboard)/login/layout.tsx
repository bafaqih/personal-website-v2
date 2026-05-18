import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login | Fadil Bafagih",
  description: "Sign in to Admin Dashboard.",
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
