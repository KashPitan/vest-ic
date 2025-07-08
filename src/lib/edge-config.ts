/**
 * Updates Vercel Edge Config items via REST API.
 * @param items Array of item operations for Edge Config
 * @returns The API response JSON
 */
export async function updateEdgeConfigItems(items: unknown[]) {
  const edgeConfigId = process.env.EDGE_CONFIG_ID;
  const vercelToken = process.env.VERCEL_TOKEN;
  if (!edgeConfigId || !vercelToken) {
    return {
      error: "Missing Edge Config ID or Vercel API token.",
      status: 500,
    };
  }
  const res = await fetch(
    `https://api.vercel.com/v1/edge-config/${edgeConfigId}/items`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${vercelToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ items }),
    },
  );
  const data = await res.json();
  return data;
}
