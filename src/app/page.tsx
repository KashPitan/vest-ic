import Image from "next/image";
import Header from "@/components/public/home-page/header";
import LeftColumn from "@/components/public/home-page/left-column";
import AccordionSection from "@/components/public/home-page/accordion-section";
import Footer from "@/components/public/home-page/footer";
import accordionData from "@/data/accordion-data.json";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-black">
      {/* Background graphic */}
      <div className="absolute inset-0 -z-10 opacity-10">
        <Image
          src="/placeholder.svg?height=1200&width=1200"
          alt="Background graphic"
          fill
          className="object-cover"
        />
      </div>

      <Header />

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-6 py-4 flex flex-col lg:flex-row gap-12">
        {/* Left Column - Scrollable Content (35%) */}
        <div className="lg:w-3/10 h-[calc(100vh-16rem)] overflow-y-auto pr-4 hide-scrollbar py-12">
          <LeftColumn />
        </div>

        {/* Right Column - Accordions (65%) */}
        <div className="lg:w-7/10 lg:pl-12 flex items-center">
          <AccordionSection items={accordionData.items} />
        </div>
      </main>

      <Footer />
    </div>
  );
}
