import Link from "next/link";
import type React from "react";

export default function SocialLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link href={href} className="text-pure-white hover:text-flat-gold">
      {children}
    </Link>
  );
}
