"use client";
import React from "react";
import { Question } from "@/types/quiz";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

interface Props {
  q: Question;
  value?: string;
  onChange: (val: string) => void;
}

export function QuestionStep({ q, value, onChange }: Props) {
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
      <Card className="border-white/10 bg-gray-100/70 backdrop-blur-xl shadow-2xl">
        <CardContent className="space-y-5 p-6">
          <div className="flex items-center gap-2 text-lg font-semibold">
            <Sparkles className="h-5 w-5 text-primary" />
            <span className="leading-7">{q.text}</span>
          </div>
          <RadioGroup value={value ?? ""} onValueChange={onChange} className="grid gap-3">
            {q.options.map((opt) => (
              <label
                key={opt.id}
                className={cn(
                  "group relative flex cursor-pointer items-center gap-3 rounded-2xl border p-4 transition",
                  "border-white/10 bg-black/30 hover:bg-black/40",
                  value === opt.id ? "ring-2 ring-primary/40 border-primary/40" : ""
                )}
                dir='rtl'
              >
                <div className="absolute inset-0 -z-[1] rounded-2xl bg-gradient-to-r from-primary/10 to-fuchsia-500/10 opacity-0 blur-2xl transition-opacity group-hover:opacity-100" />
                <RadioGroupItem id={`${q.id}-${opt.id}`} value={opt.id} />
                <Label htmlFor={`${q.id}-${opt.id}`} className="cursor-pointer text-base">
                  {opt.label}
                </Label>
              </label>
            ))}
          </RadioGroup>
        </CardContent>
      </Card>
    </motion.div>
  );
}
