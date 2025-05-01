import { Accordion } from "@/components/ui/accordion";
import CustomAccordionItem from "./custom-accordion-item";
import Link from "next/link";
import { elza } from "@/fonts";

interface AccordionItem {
  value: string;
  title: string;
  content: string;
  imageSrc: string;
}

interface AccordionSectionProps {
  items: AccordionItem[];
}

export default function AccordionSection({ items }: AccordionSectionProps) {
  return (
    <div className="h-full flex flex-col justify-center">
      <Accordion
        type="single"
        defaultValue="item-1"
        className="space-y-8 mb-10"
      >
        {items.map((item) => (
          <CustomAccordionItem
            key={item.value}
            value={item.value}
            title={item.title}
            content={item.content}
            imageSrc={item.imageSrc}
          />
        ))}
      </Accordion>

      <div className="flex justify-center">
        <Link
          href="/insights"
          className={`text-pure-white hover:text-highlight-yellow transition-colors ${elza.className}`}
        >
          Read More
        </Link>
      </div>
    </div>
  );
}
