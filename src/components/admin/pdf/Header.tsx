import Image from "next/image";
import { elza, elzaNormal } from "@/fonts";

interface HeaderProps {
  headerDate: string | null;
}

export default function Header({ headerDate }: HeaderProps) {
  return (
    <div className="absolute inset-x-0 top-0">
      <div
        className={`flex bg-racing-green text-pure-white min-h-[80px] ${elza.className}`}
      >
        <div className="flex w-full justify-between p-4">
          <div className="flex">
            <Image
              src={"/VestICLogo.png"}
              alt="vest-ic-logo-header"
              width="45"
              height="45"
            />
            <div className="text-2xl font-bold content-center">Vest IC</div>
          </div>
          <div className="self-center">
            <h1>Vest IC - Product Name</h1>
            <h2 className={`${elzaNormal.className}`}>
              Factsheet - {headerDate || "N/A"}
            </h2>
          </div>
        </div>
      </div>
    </div>
  );
}
