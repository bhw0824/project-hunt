import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function fetchSAM() {
  const res = await fetch(
  `https://api.sam.gov/prod/opportunities/v2/search?limit=25&api_key=${process.env.SAM_API_KEY}&q=fiber%20broadband%20telecommunications%20utility%20pole%20make%20ready%20aerial%20construction`
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
    const samLeads = await fetchSAM();

    const { data, error } = await supabase
      .from("leads")
      .upsert(samLeads, { onConflict: "source_url" })
      .select();

    if (error) {
      return new Response(
        JSON.stringify({ inserted: 0, error: error.message }),
        { status: 500 }
      );
    }

    return new Response(
      JSON.stringify({ inserted: data.length }),
      { status: 200 }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ inserted: 0, error: err.message }),
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
