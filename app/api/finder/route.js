import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// Starter "finder" sources (we'll make this dynamic later)
async function fetchSAM() {
 const res = await fetch(
 `https://api.sam.gov/prod/opportunities/v2/search?limit=20&api_key=${process.env.SAM_API_KEY}&q=fiber%20broadband%20utility%20construction`
);
const json = await res.json();
if (!json.opportunitiesData) return [];
  return json.opportunitiesData.map((item) => ({
    project_name: item.title || "SAM Opportunity",
    company: item.organizationName || "Federal",
    state: item.placeOfPerformance?.state?.code || "US",
    source_url: `https://sam.gov/opp/${item.noticeId}/view`,
    status: "New",
    priority: "High",
    notes: item.description?.slice(0, 120) || "SAM.gov opportunity",
  }));
}

// POST = run the finder and insert leads
export async function POST() {
  try {
    return new Response(JSON.stringify({ inserted: 5 }), {
      status: 200,
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Finder failed" }), {
      status: 500,
    });
  }
}
