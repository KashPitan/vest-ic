import { Button } from "@/components/ui/button";
import { elza } from "@/fonts";

export default function RegisterSection() {
  return (
    <section className="pt-8 flex justify-center">
      <Button
        className={`px-8 py-6 text-lg rounded-full bg-flat-gold hover:bg-flat-gold/90 text-black ${elza.className}`}
      >
        Register Your Interest
      </Button>
    </section>
  );
}
