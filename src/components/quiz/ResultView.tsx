"use client";
import React from "react";
import Image from "next/image";
import { TMDbMovie } from "@/types/quiz";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getPosterUrl } from "@/lib/tmdb";
import { motion } from "framer-motion";
import { Film } from "lucide-react";

interface Props {
  movies: TMDbMovie[];
  traits: string[];
  onRestart: () => void;
}

export function ResultView({ movies, traits, onRestart }: Props) {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="secondary" className="bg-white/10 text-white backdrop-blur">ترجیحات</Badge>
        {traits.map((t) => (
          <Badge key={t} variant="outline" className="border-white/20 text-white">{t}</Badge>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {movies.map((m, i) => (
          <motion.div key={m.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25, delay: i * 0.03 }}>
            <Card className="group overflow-hidden border-white/10 bg-black/40 backdrop-blur-xl transition hover:translate-y-[-2px] hover:border-primary/40 hover:shadow-[0_0_40px_-10px] hover:shadow-primary/40">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-base text-white">
                  <Film className="h-4 w-4 text-primary" />
                  <span className="line-clamp-2">{m.title}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {m.poster_path && (
                  <div className="relative">
                    <Image
                      src={getPosterUrl(m.poster_path, "w342")!}
                      alt={m.title}
                      width={342}
                      height={513}
                      className="h-auto w-full rounded-lg object-cover"
                    />
                    <div className="pointer-events-none absolute inset-0 rounded-lg bg-gradient-to-t from-black/60 to-transparent opacity-90" />
                  </div>
                )}
                <p className="line-clamp-4 text-sm text-zinc-300">{m.overview}</p>
                <div className="flex items-center justify-between text-xs text-zinc-400">
                  <span>امتیاز TMDb: {m.vote_average?.toFixed(1)}</span>
                  {m.release_date && <span>{new Date(m.release_date).getFullYear()}</span>}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
