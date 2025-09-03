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
import { discoverByTraits } from "@/lib/tmdb";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
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
  const progress = Math.round((Math.min(step, total) / total) * 100);
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


  // Results state
  if (movies.length || loading || error) {
    return (
      <div className="relative min-h-[60vh]">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-violet-600/20 via-transparent to-transparent" />
        <Card className="mx-auto max-w-5xl border-white/10 bg-black/50 p-2 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">پیشنهاد فیلم بر اساس روحیاتت</CardTitle>
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
    <div className="relative min-h-[70vh]">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-black via-zinc-900 to-black" />
      <div className="pointer-events-none absolute inset-0 -z-10 [mask-image:radial-gradient(60%_60%_at_50%_20%,#000_20%,transparent_70%)] bg-[radial-gradient(circle_at_10%_10%,rgba(124,58,237,0.25),transparent_35%),radial-gradient(circle_at_90%_20%,rgba(236,72,153,0.25),transparent_35%),radial-gradient(circle_at_50%_90%,rgba(59,130,246,0.2),transparent_40%)]" />


      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
        <Card className="mx-auto max-w-2xl border-white/10 bg-black/50 backdrop-blur-xl">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">آزمون انتخاب فیلم</CardTitle>
              <span className="text-sm text-zinc-400">{progress}%</span>
            </div>
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-violet-500/30 to-fuchsia-500/30 blur-lg" />
              <Progress value={progress} className="h-2 rounded-full bg-white/10 [&>div]:rounded-full [&>div]:bg-gradient-to-r [&>div]:from-violet-500 [&>div]:to-fuchsia-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-4 text-sm text-zinc-400">سؤال {step + 1} از {total}</div>
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