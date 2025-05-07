import Link from "next/link";
import SocialLink from "./social-link";
import { elza } from "@/fonts";

export default function Footer() {
  return (
    <footer
      className={`bg-racing-green/80 py-6 border-t border-racing-green backdrop-blur-md ${elza.className}`}
    >
      <div className="container mx-auto px-6">
        <div className="flex flex-wrap items-center justify-between">
          <div className="flex items-center space-x-6">
            <p className="text-sm text-pure-white">© Vest IC. 2025</p>
            <Link
              href="/disclaimer"
              className="text-sm text-pure-white hover:text-flat-gold"
            >
              Disclaimer
            </Link>
            <Link
              href="/cookie-policy"
              className="text-sm text-pure-white hover:text-flat-gold"
            >
              Cookie Policy
            </Link>
          </div>
          <div className="flex items-center space-x-6">
            <SocialLink href="https://linkedin.com">LinkedIn</SocialLink>
            <SocialLink href="https://tiktok.com">Tik Tok</SocialLink>
            <SocialLink href="https://instagram.com">Instagram</SocialLink>
          </div>
        </div>
      </div>
    </footer>
  );
}
