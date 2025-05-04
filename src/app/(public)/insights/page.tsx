import { Tag } from "../../../../payload-types";
import { getPosts } from "@/data-access-layer/posts";
import { getTags } from "@/data-access-layer/tags";
import { InsightsListView } from "./InsightsListView";

const Insights = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const query = await searchParams;
  const { data: posts, hasNextPage, hasPrevPage } = await getPosts(query);
  const { data: tags }: { data: Tag[] } = await getTags();
  return (
    <div>
      <InsightsListView
        posts={posts}
        tags={tags}
        hasNext={hasNextPage}
        hasPrevious={hasPrevPage}
      />
    </div>
  );
};

export default Insights;
