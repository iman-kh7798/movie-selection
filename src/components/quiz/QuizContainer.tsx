"use client";
import React, { useEffect, useMemo, useState } from "react";
import { QUESTIONS } from "@/data/questions";
import { Question, Trait } from "@/types/quiz";
import { QuestionStep } from "@/components/quiz/QuestionStep";
import { ResultView } from "@/components/quiz/ResultView";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { discoverByTraits } from "@/lib/tmdb";

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
  const [movies, setMovies] = useState([]); // TMDb results
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
      for (const [trait, w] of Object.entries(opt.weight) as [
        Trait,
        number
      ][]) {
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
      <Card className="mx-auto max-w-4xl">
        <CardHeader>
          <CardTitle>پیشنهاد فیلم بر اساس روحیاتت</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {loading && (
            <Alert>
              <AlertDescription>در حال جست‌وجو در TMDb…</AlertDescription>
            </Alert>
          )}
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {!loading && !error && (
            <ResultView
              movies={movies as any}
              traits={Object.keys(scores).filter((k) => (scores as any)[k] > 0)}
              onRestart={onRestart}
            />
          )}
        </CardContent>
        <CardFooter>
          <Button variant="ghost" onClick={onRestart}>
            شروع دوباره
          </Button>
        </CardFooter>
      </Card>
    );
  }

  // Quiz state
  if (!ordered.length) return null;

  return (
    <Card className="mx-auto max-w-2xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>آزمون انتخاب فیلم</CardTitle>
          <span className="text-sm text-muted-foreground">
            {progress}% تکمیل
          </span>
        </div>
        <Progress value={progress} className="h-2" />
      </CardHeader>
      <CardContent>
        <div className="mb-4 text-sm text-muted-foreground">
          سؤال {step + 1} از {total}
        </div>
        <QuestionStep
          q={current}
          value={answers[current.id]}
          onChange={(val) => setAnswers((a) => ({ ...a, [current.id]: val }))}
        />
      </CardContent>
      <CardFooter className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack} disabled={step === 0}>
          قبلی
        </Button>
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            onClick={() => {
              const randomOpt =
                current.options[
                  Math.floor(Math.random() * current.options.length)
                ].id;
              setAnswers((a) => ({ ...a, [current.id]: randomOpt }));
              onNext();
            }}
          >
            شانسی
          </Button>
          <Button onClick={onNext} disabled={!answers[current.id]}>
            بعدی
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
