import Image from "next/image";
import Header from "@/components/public/home-page/header";
import LeftColumn from "@/components/public/home-page/left-column";
import AccordionSection from "@/components/public/home-page/accordion-section";
import Footer from "@/components/public/home-page/footer";
import accordionData from "@/data/accordion-data.json";

export default function Home() {
  return (
    <div className="container mx-auto px-6 py-4 flex flex-col lg:flex-row gap-12 items-center">
      {/* Left Column - Scrollable Content (35%) */}
      <div className="lg:w-3/10 h-[70vh] max-h-[600px] overflow-y-auto pr-4 hide-scrollbar py-8 my-auto">
        <LeftColumn />
      </div>

      {/* Right Column - Accordions (65%) */}
      <div className="lg:w-7/10 lg:pl-12 flex items-center">
        <AccordionSection items={accordionData.items} />;
      </div>
    </div>
  );
}
