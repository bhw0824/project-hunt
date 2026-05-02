export async function POST() {
  return new Response(
    JSON.stringify({ inserted: 5 }),
    { status: 200 }
  );
}

export async function GET() {
  return new Response(
    JSON.stringify({ ok: true, message: "Finder API is live" }),
    { status: 200 }
  );
}
