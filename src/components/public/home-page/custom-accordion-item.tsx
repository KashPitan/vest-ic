import Image from "next/image";
import { Minus, Plus } from "lucide-react";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { elza } from "@/fonts";

interface CustomAccordionItemProps {
  value: string;
  title: string;
  content: string;
  imageSrc: string;
}

export default function CustomAccordionItem({
  value,
  title,
  content,
  imageSrc,
}: CustomAccordionItemProps) {
  return (
    <AccordionItem
      value={value}
      className="border border-pure-white/20 rounded-lg overflow-hidden shadow-sm bg-pure-white/10 backdrop-blur-[10px]"
    >
      <AccordionTrigger className="px-6 py-4 text-left font-medium text-pure-white hover:text-pure-white hover:bg-pure-white/5">
        <div className="flex items-center justify-between w-full">
          <span className={`truncate ${elza.className}`}>{title}</span>
          <div className="flex-shrink-0 ml-2">
            <Plus className="h-5 w-5 group-data-[state=open]:hidden" />
            <Minus className="h-5 w-5 hidden group-data-[state=open]:block" />
          </div>
        </div>
      </AccordionTrigger>
      <AccordionContent className="p-0">
        <div className="flex flex-col md:flex-row min-h-[280px]">
          {/* Content on the left (65%) */}
          <div className="md:w-[65%] p-8">
            <p className="text-pure-white text-lg leading-relaxed">{content}</p>
          </div>
          {/* Image on the right (35%) */}
          <div className="md:w-[35%] p-6">
            <div className="relative h-56 md:h-full rounded-lg overflow-hidden">
              <Image
                src={imageSrc || "/placeholder.svg"}
                alt={title}
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}
