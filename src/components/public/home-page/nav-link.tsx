import Link from "next/link"
import type React from "react"

export default function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="font-medium transition-colors text-pure-white hover:text-highlight-yellow active:text-highlight-yellow"
    >
      {children}
    </Link>
  )
}
