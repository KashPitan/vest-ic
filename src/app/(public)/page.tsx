import LeftColumn from "@/components/public/home-page/left-column";
import AccordionSection from "@/components/public/home-page/accordion-section";
import { getHighlightedPosts } from "@/data-access-layer/highlights";
import { articulat } from "@/fonts";

export default async function Home() {
  const highlightedPosts = await getHighlightedPosts();

  // TODO: fix typing so we don't need bangs here
  const accordionItems =
    highlightedPosts.length > 0
      ? highlightedPosts.map(({ post }) => ({
          title: post!.title,
          value: `${post!.id}`,
          content: post!.excerpt,
          imageSrc: post!.displayImageUrl,
        }))
      : [];

  return (
    <div
      className={`${articulat.className} container mx-auto px-6 py-4 flex flex-col lg:flex-row gap-12 items-center`}
    >
      {/* Left Column - Scrollable Content (35%) */}
      <div className="lg:w-3/10 h-[70vh] max-h-[600px] overflow-y-auto pr-4 hide-scrollbar py-8 my-auto">
        <LeftColumn />
      </div>

      {/* Right Column - Accordions (65%) */}
      <div className="lg:w-7/10 lg:pl-12 flex items-center">
        <AccordionSection items={accordionItems} />
      </div>
    </div>
  );
}
