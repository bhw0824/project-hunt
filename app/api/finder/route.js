import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// Starter "finder" sources (we'll make this dynamic later)
const starterLeads = [
{
    project_name: "SAM.gov Fiber / Broadband RFP Search",
    company: "Federal Contract Opportunities",
    state: "US",
    source_url: "https://sam.gov/search/?index=opp&keywords=broadband%20fiber",
    status: "New",
    priority: "High",
    notes: "Federal RFP source..."
  },
  {
  project_name: "NTIA Funding Announcements",
  company: "NTIA",
  state: "US",
  source_url: "https://www.ntia.gov/funding-programs",
  status: "New",
  priority: "High",
  notes: "Tracks federal broadband funding"
}
];
// POST = run the finder and insert leads
export async function POST() {
  const { data, error } = await supabase
    .from("leads")
    .upsert(starterLeads, { onConflict: 'source_url' })
    .select();

  if (error) {
    return new Response(
      JSON.stringify({ ok: false, error: error.message }),
      { status: 500 }
    );
  }

  return new Response(
    JSON.stringify({ ok: true, inserted: data.length, data }),
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
