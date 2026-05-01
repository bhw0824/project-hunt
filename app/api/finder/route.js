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
);
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
  const samLeads = await fetchSAM();

  const { data, error } = await supabase
    .from("leads")
    .upsert(samLeads, { onConflict: "source_url" })
    .select('*');

  if (error) {
    return new Response(
      JSON.stringify({ ok: false, error: error.message }),
      { status: 500 }
    );
  }

  return new Response(
    JSON.stringify({ ok: true, inserted: data ? data.length : 0, data }),
    { status: 200 }
  );
}

// GET = simple test to confirm route works
export async function GET() {
  return new Response(
    JSON.stringify({ ok: true, message: "Finder API is live" }),
    { status: 200 }
  );
}
// POST = run the finder and insert leads

    { status: 200 }
  );
}
