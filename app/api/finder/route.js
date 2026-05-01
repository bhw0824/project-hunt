import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// Starter "finder" sources (we'll make this dynamic later)
const starterLeads = [
  {
    project_name: "BEAD Broadband Project Watch",
    company: "State Broadband Office",
    state: "MULTI",
    source_url: "https://www.internetforall.gov/",
    status: "New",
    priority: "High",
    notes: "Tracks BEAD funding and broadband rollout projects."
  },
  {
    project_name: "NTIA Funding Monitor",
    company: "NTIA",
    state: "US",
    source_url: "https://www.ntia.gov/",
    status: "New",
    priority: "High",
    notes: "Tracks federal broadband funding announcements."
  },
  {
    project_name: "State RFP Sweep",
    company: "Multiple",
    state: "US",
    source_url: "https://www.internetforall.gov/funding-recipients",
    status: "New",
    priority: "High",
    notes: "Finds awardees and construction regions."
  }
];

// POST = run the finder and insert leads
export async function POST() {
  const { data, error } = await supabase
    .from("leads")
    .insert(starterLeads)
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
