import { elza } from "@/fonts";
import NavLink from "./nav-link";

export default function Header() {
  return (
    <header
      className={`bg-racing-green/80 py-6 px-6 shadow-md backdrop-blur-md ${elza.className}`}
    >
      <nav className="container mx-auto flex justify-between items-center">
        <div className="text-2xl font-bold text-pure-white">Vest IC</div>
        <div className="flex gap-8">
          <NavLink href="/insights">Insights</NavLink>
          <NavLink href="/about">About</NavLink>
          <NavLink href="/contact">Contact</NavLink>
        </div>
      </nav>
    </header>
  );
}
