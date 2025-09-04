// --------------------------------------------------
// components/quiz/QuizContainer.tsx — orchestration & API call (Galaxy Gradient Background)
"use client";
import React, { useEffect, useMemo, useState } from "react";
import { QUESTIONS } from "@/data/questions";
import { Question, Trait } from "@/types/quiz";
import { QuestionStep } from "@/components/quiz/QuestionStep";
import { ResultView } from "@/components/quiz/ResultView";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { discoverByTraits } from "@/lib/tmdb";
import { motion } from "framer-motion";
import { Loader2, Sparkles } from "lucide-react";

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function CinematicStepper({ step, total }: { step: number; total: number }) {
  return (
    <div className="relative">
      <div className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-r from-violet-500/20 to-fuchsia-500/20 blur-xl" />
      <div className="h-2 w-full rounded-full bg-white/10">
        <div
          className="h-2 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 transition-[width]"
          style={{ width: `${Math.round(((step + 1) / total) * 100)}%` }}
        />
      </div>
      <div className="mt-3 grid grid-cols-8 gap-2 md:grid-cols-12">
        {Array.from({ length: total }).map((_, i) => (
          <div
            key={i}
            className={
              "h-1.5 rounded-full " + (i <= step ? "bg-white/70" : "bg-white/15")
            }
          />
        ))}
      </div>
    </div>
  );
}

export default function QuizContainer() {
  const [ordered, setOrdered] = useState<Question[]>([]);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setOrdered(shuffle(QUESTIONS));
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowLeft") setStep((s) => (s > 0 ? s - 1 : s));
      if (e.key === "ArrowRight") setStep((s) => (s < (ordered.length || QUESTIONS.length) - 1 ? s + 1 : s));
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [ordered.length]);

  const scores = useMemo(() => {
    const s: Record<Trait, number> = {
      adventure: 0,
      romance: 0,
      comedy: 0,
      drama: 0,
      thriller: 0,
      animation: 0,
      sciFi: 0,
    };
    for (const q of ordered) {
      const chosen = answers[q.id];
      if (!chosen) continue;
      const opt = q.options.find((o) => o.id === chosen);
      if (!opt) continue;
      for (const [trait, w] of Object.entries(opt.weight) as [Trait, number][]) {
        s[trait] += w;
      }
    }
    return s;
  }, [answers, ordered]);

  const total = ordered.length || QUESTIONS.length;
  const progress = Math.round((Math.min(step + 1, total) / total) * 100);
  const current = ordered[step];

  async function fetchAndShow() {
    setLoading(true);
    setError(null);
    try {
      const results = await discoverByTraits(scores);
      // @ts-ignore
      setMovies(results);
    } catch (e: any) {
      setError(e?.message ?? "خطا در دریافت نتایج");
    } finally {
      setLoading(false);
    }
  }

  const onNext = () => {
    if (step < total - 1) setStep((s) => s + 1);
    else fetchAndShow();
  };

  const onBack = () => {
    if (step > 0) setStep((s) => s - 1);
  };

  const onRestart = () => {
    setAnswers({});
    setStep(0);
    setMovies([]);
    setError(null);
    setOrdered(shuffle(QUESTIONS));
  };

  // Galaxy BG component (twinkling + meteors) without changing file structure
  const GalaxyBG = () => (
    <>
      {/* base gradient layers */}
      <div className="pointer-events-none absolute inset-0 -z-30 bg-gradient-to-b from-indigo-950 via-purple-900 to-black" />
      <div className="pointer-events-none absolute inset-0 -z-40 bg-[radial-gradient(circle_at_10%_20%,rgba(59,130,246,0.28),transparent_45%),radial-gradient(circle_at_90%_15%,rgba(236,72,153,0.28),transparent_45%),radial-gradient(circle_at_50%_85%,rgba(147,51,234,0.28),transparent_45%)]" />

      {/* static starfield (efficient box-shadow trick) */}
      <div className="pointer-events-none absolute -z-20 h-1 w-1 opacity-70" style={{ left: 0, top: 0, boxShadow: starShadow(2500, 1800) }} />
      {/* twinkling stars */}
      <div className="pointer-events-none absolute inset-0 -z-20 twinkle" />
      {/* slow parallax nebula mist */}
      <div className="pointer-events-none absolute inset-0 -z-20 animate-slowFloat bg-[radial-gradient(1200px_800px_at_70%_10%,rgba(255,255,255,0.05),transparent_60%)]" />
      {/* shooting meteors */}
      <div className="pointer-events-none absolute inset-0 -z-10 meteors" />
      <style jsx global>{`
        @keyframes twinkleKey { 0%, 100% { opacity: .35 } 50% { opacity: .85 } }
        @keyframes meteor { 0% { transform: translate3d(0,0,0) rotate(215deg); opacity: 0 } 10% { opacity: .9 } 100% { transform: translate3d(-1200px, 1200px, 0) rotate(215deg); opacity: 0 } }
        @keyframes slowFloat { 0% { transform: translateY(0) } 50% { transform: translateY(-12px) } 100% { transform: translateY(0) } }
        .twinkle { background-image: radial-gradient(2px 2px at 20% 30%, rgba(255,255,255,.8), transparent 60%), radial-gradient(1.5px 1.5px at 40% 70%, rgba(255,255,255,.7), transparent 60%), radial-gradient(1.5px 1.5px at 75% 25%, rgba(255,255,255,.65), transparent 60%), radial-gradient(2px 2px at 65% 55%, rgba(255,255,255,.75), transparent 60%); animation: twinkleKey 3.6s ease-in-out infinite; }
        .meteors { position: absolute; overflow: hidden; }
        .meteors::before, .meteors::after { content: ""; position: absolute; top: -200px; right: -200px; width: 2px; height: 2px; background: linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,.9)); box-shadow: 0 0 8px rgba(255,255,255,.9); border-radius: 9999px; transform: rotate(215deg); animation: meteor 6s linear infinite; }
        .meteors::after { animation-delay: 3s; top: -100px; right: -50px; }
        .animate-slowFloat { animation: slowFloat 18s ease-in-out infinite; }
      `}</style>
    </>
  );

  // Helper to generate many stars via box-shadow for perf
  function starShadow(count: number, spread: number) {
    const arr: string[] = [];
    for (let i = 0; i < count; i++) {
      const x = Math.floor(Math.random() * (spread * 2)) - spread; // -spread..spread
      const y = Math.floor(Math.random() * (spread * 2)) - spread;
      const opacity = (Math.random() * 0.8 + 0.2).toFixed(2);
      arr.push(`${x}px ${y}px 0 0 rgba(255,255,255,${opacity})`);
    }
    return arr.join(",");
  }

  // Results state
  if (movies.length || loading || error) {
    return (
      <div className="relative min-h-[60vh]">
        <GalaxyBG />
        <Card className="mx-auto max-w-5xl border-white/10 bg-black/50 p-2 backdrop-blur-xl">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">پیشنهاد فیلم بر اساس روحیاتت</CardTitle>
              <Badge variant="secondary" className="bg-white/10 text-xs text-zinc-200">TMDb</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {loading && (
              <Alert>
                <AlertDescription className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" /> در حال جست‌وجو در TMDb…
                </AlertDescription>
              </Alert>
            )}
            {error && <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>}
            {!loading && !error && (
              <ResultView movies={movies as any} traits={Object.keys(scores).filter(k => (scores as any)[k] > 0)} onRestart={onRestart} />
            )}
          </CardContent>
          <CardFooter>
            <Button variant="ghost" onClick={onRestart} className="text-zinc-200">شروع دوباره</Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  if (!ordered.length) return null;

  return (
    <div className="relative min-h-[100vh] py-6">
      <GalaxyBG />
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
        <Card className="mx-auto max-w-2xl border-white/10 bg-black/50 backdrop-blur-xl">
          <CardHeader className="space-y-4">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
                <Sparkles className="h-5 w-5 text-white" /> آزمون انتخاب فیلم
              </CardTitle>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Badge variant="outline" className="border-white/20 text-zinc-300">{progress}%</Badge>
                  </TooltipTrigger>
                  <TooltipContent className="text-xs">درصد پیشرفت</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <CinematicStepper step={step} total={total} />
          </CardHeader>
          <CardContent>
            <div className="mb-3 flex items-center justify-between text-xs text-zinc-400">
              <span>سؤال {step + 1} از {total}</span>
              <span>راهنما: با کلیدهای ⇦ و ⇨ حرکت کن</span>
            </div>
            <Separator className="mb-5 bg-white/10" />
            <QuestionStep
              q={current}
              value={answers[current.id]}
              onChange={(val) => setAnswers((a) => ({ ...a, [current.id]: val }))}
            />
          </CardContent>
          <CardFooter className="flex items-center justify-between">
            <Button variant="ghost" onClick={onBack} disabled={step === 0} className="text-zinc-300">قبلی</Button>
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                onClick={() => {
                  const randomOpt = current.options[Math.floor(Math.random() * current.options.length)].id;
                  setAnswers((a) => ({ ...a, [current.id]: randomOpt }));
                  onNext();
                }}
                className="rounded-xl bg-white/10 text-white backdrop-blur hover:bg-white/15"
              >
                شانسی
              </Button>
              <Button
                onClick={onNext}
                disabled={!answers[current.id]}
                className="rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-lg shadow-fuchsia-500/20 hover:from-violet-500 hover:to-fuchsia-500"
              >
                بعدی
              </Button>
            </div>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}

// --------------------------------------------------
