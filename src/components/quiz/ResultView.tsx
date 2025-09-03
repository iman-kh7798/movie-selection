"use client";
import React from "react";
import Image from "next/image";
import { TMDbMovie } from "@/types/quiz";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getPosterUrl } from "@/lib/tmdb";

interface Props {
  movies: TMDbMovie[];
  traits: string[];
  onRestart: () => void;
}

export function ResultView({ movies, traits, onRestart }: Props) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        {traits.map((t) => (
          <Badge key={t} variant="secondary">
            {t}
          </Badge>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {movies.map((m) => (
          <Card key={m.id} className="overflow-hidden">
            <CardHeader>
              <CardTitle className="line-clamp-2 text-base">
                {m.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {m.poster_path && (
                <Image
                  src={getPosterUrl(m.poster_path, "w342")!}
                  alt={m.title}
                  width={342}
                  height={513}
                  className="h-auto w-full rounded-lg"
                />
              )}
              <p className="line-clamp-4 text-sm text-muted-foreground">
                {m.overview}
              </p>
              <div className="text-xs text-muted-foreground">
                امتیاز TMDb: {m.vote_average?.toFixed(1)}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <button className="mt-2 rounded-xl border px-4 py-2" onClick={onRestart}>
        شروع دوباره
      </button>
    </div>
  );
}
