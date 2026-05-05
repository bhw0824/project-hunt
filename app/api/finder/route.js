// FORCE NEW DEPLOY
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function fetchSAM() {
  const res = await fetch(
 `https://api.sam.gov/prod/opportunities/v2/search?limit=25&api_key=${process.env.SAM_API_KEY}&postedFrom=01/01/2026&postedTo=12/31/2026`
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

export async function POST() {
  try {
    const samLeads = [{
  project_name: "TEST - Fiber Make Ready Project",
  company: "Test Utility",
  state: "CO",
  source_url: "https://sam.gov",
  status: "New",
  priority: "High",
  notes: "Manual test lead to confirm Supabase insert is working"
}];

    const { error } = await supabase
  .from("leads")
  .insert(samLeads);

if (error) {
  return new Response(
    JSON.stringify({ insertedCount: 0, error: error.message }),
    { status: 500 }
  );
}

return new Response(
  JSON.stringify({ insertedCount: samLeads.length }),
  { status: 200 }
);
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ insertedCount: 0, error: err.message })
      { status: 500 }
    );
  }
}

export async function GET() {
  return new Response(
    JSON.stringify({ ok: true, message: "Finder API is live" }),
    { status: 200 }
  );
}
