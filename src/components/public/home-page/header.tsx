"use client";

import Image from "next/image";
import { elza } from "@/fonts";
import NavLink from "./nav-link";
import { usePathname } from "next/navigation";

interface HeaderProps {
  loggedIn: boolean;
}

const NavItems = ({ loggedIn }: HeaderProps) => {
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";
  return (
    <div className="flex gap-8 text-2xl">
      <NavLink href="/insights">Insights</NavLink>
      <NavLink href="/about">About</NavLink>
      <NavLink href="/contact">Contact</NavLink>
      {loggedIn ? (
        !isLoginPage && <NavLink href="/login">Logout</NavLink>
      ) : (
        <>
          {!isLoginPage && <NavLink href="/login">Login</NavLink>}
          <NavLink href="/signup">Sign up</NavLink>
        </>
      )}
    </div>
  );
};

const NonHomePageHeader = ({ loggedIn }: HeaderProps) => (
  <header
    className={`bg-racing-green/80 py-6 px-6 shadow-md backdrop-blur-md ${elza.className}`}
  >
    <nav className="container mx-auto flex justify-between items-center">
      <div className="flex">
        <Image
          src={"/VestICLogo.png"}
          alt="vest-ic-logo-header"
          width="92"
          height="92"
        />
        <div className="text-5xl pl-9 font-bold text-pure-white content-center">
          Vest IC
        </div>
      </div>

      <NavItems loggedIn={loggedIn} />
    </nav>
  </header>
);

const HomePageHeader = ({ loggedIn }: HeaderProps) => (
  <header
    className={`bg-racing-green/80 py-6 px-6 h-[120px] shadow-md backdrop-blur-md relative content-center ${elza.className}`}
  >
    <Image
      src={"/VestICLogo.png"}
      alt="vest-ic-logo-header"
      width="130"
      height="130"
      className="absolute top-[50px]"
    />
    <nav className="container mx-auto flex justify-end">
      <NavItems loggedIn={loggedIn} />
    </nav>
  </header>
);

export default function Header({ loggedIn }: HeaderProps) {
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  return (
    <>
      {isHomePage ? (
        <HomePageHeader loggedIn={loggedIn} />
      ) : (
        <NonHomePageHeader loggedIn={loggedIn} />
      )}
    </>
  );
}
