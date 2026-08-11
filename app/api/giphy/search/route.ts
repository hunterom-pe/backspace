import { NextResponse, type NextRequest } from "next/server";

const GIPHY_BASE = "https://api.giphy.com/v1/gifs";

type GiphyImage = { url: string };
type GiphyGif = {
  id: string;
  title: string;
  images: {
    fixed_width_small?: GiphyImage;
    fixed_width?: GiphyImage;
    original?: GiphyImage;
  };
};

export async function GET(request: NextRequest) {
  const apiKey = process.env.GIPHY_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "GIF search is not configured." }, { status: 503 });
  }

  const query = new URL(request.url).searchParams.get("q")?.trim();
  const endpoint = query ? "search" : "trending";

  const giphyUrl = new URL(`${GIPHY_BASE}/${endpoint}`);
  giphyUrl.searchParams.set("api_key", apiKey);
  giphyUrl.searchParams.set("limit", "24");
  giphyUrl.searchParams.set("rating", "pg-13");
  if (query) giphyUrl.searchParams.set("q", query);

  const giphyRes = await fetch(giphyUrl, { cache: "no-store" });
  if (!giphyRes.ok) {
    return NextResponse.json({ error: "GIF search failed." }, { status: 502 });
  }

  const data: { data: GiphyGif[] } = await giphyRes.json();
  const gifs = data.data.map((gif) => ({
    id: gif.id,
    title: gif.title,
    previewUrl: gif.images.fixed_width_small?.url ?? gif.images.fixed_width?.url ?? "",
    url: gif.images.fixed_width?.url ?? gif.images.original?.url ?? "",
  }));

  return NextResponse.json({ gifs });
}
