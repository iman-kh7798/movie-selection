import { Trait, TMDbMovie } from "@/types/quiz";
import { TRAIT_TO_TMDB_GENRES } from "@/lib/trait-map";

const TMDB_BASE = "https://api.themoviedb.org/3";
const TMDB_KEY = process.env.NEXT_PUBLIC_TMDB_KEY!;

export async function discoverByTraits(scores: Record<Trait, number>): Promise<TMDbMovie[]> {
  const entries = Object.entries(scores) as [Trait, number][];
  entries.sort((a, b) => b[1] - a[1]);
  const top = entries.slice(0, 2).map(([t]) => t);
  const genreIds = top.flatMap((t) => TRAIT_TO_TMDB_GENRES[t] ?? []);

  const url = new URL(`${TMDB_BASE}/discover/movie`);
  url.searchParams.set("api_key", TMDB_KEY);
  url.searchParams.set("include_adult", "false");
  url.searchParams.set("language", "fa-IR");
  url.searchParams.set("sort_by", "vote_average.desc");
  url.searchParams.set("vote_count.gte", "200");
  if (genreIds.length) url.searchParams.set("with_genres", genreIds.join(","));
  url.searchParams.set("primary_release_date.lte", new Date().toISOString().slice(0, 10));

  const res = await fetch(url.toString(), { cache: "no-store" });
  if (!res.ok) throw new Error("TMDb fetch failed");
  const data = await res.json();
  return (data.results ?? []) as TMDbMovie[];
}

export function getPosterUrl(path?: string | null, size: "w185" | "w342" | "w500" = "w342") {
  if (!path) return null;
  return `https://image.tmdb.org/t/p/${size}${path}`;
}
