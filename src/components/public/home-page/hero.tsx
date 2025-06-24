import { elza } from "@/fonts";

export default function Hero() {
  return (
    <section className="space-y-6 max-w-md">
      <h1 className={`text-4xl md:text-5xl ${elza.className} text-pure-white `}>
        Vest IC
      </h1>
      <p className="text-lg text-pure-white/80">
        Short 2-3 line brand summary here.
        <br />
        Short 2-3 line brand summary here.
        <br />
        Short 2-3 line brand summary here.
      </p>
    </section>
  );
}
