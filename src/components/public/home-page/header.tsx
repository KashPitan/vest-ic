import Image from "next/image";
import NavLink from "./nav-link";

export default function Header() {
  return (
    <header className="bg-racing-green/80 py-6 px-6 h-[9dvh] shadow-md backdrop-blur-md relative content-center">
      <Image
        src={"/VestICLogo.png"}
        alt="vest-ic-logo-header"
        width="130"
        height="130"
        className="absolute top-[2.75rem]"
      />
      <nav className="container mx-auto flex justify-end ">
        {/* <div className="text-2xl font-bold text-pure-white">Vest IC</div> */}
        <div className="flex gap-8">
          <NavLink href="/insights">Insights</NavLink>
          <NavLink href="/about">About</NavLink>
          <NavLink href="/contact">Contact</NavLink>
        </div>
      </nav>
    </header>
  );
}
