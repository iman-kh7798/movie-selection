"use client";
import React from "react";
import { Question } from "@/types/quiz";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface Props {
  q: Question;
  value?: string;
  onChange: (val: string) => void;
}

export function QuestionStep({ q, value, onChange }: Props) {
  return (
    <Card>
      <CardContent className="space-y-4 p-6">
        <div className="mb-2 text-lg font-medium">{q.text}</div>
        <RadioGroup
          value={value ?? ""}
          onValueChange={onChange}
          className="grid gap-3"
        >
          {q.options.map((opt) => (
            <label
              key={opt.id}
              className={cn(
                "flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition",
                value === opt.id
                  ? "border-primary ring-2 ring-primary/30"
                  : "hover:bg-muted/50"
              )}
            >
              <RadioGroupItem id={`${q.id}-${opt.id}`} value={opt.id} />
              <Label
                htmlFor={`${q.id}-${opt.id}`}
                className="cursor-pointer text-base"
              >
                {opt.label}
              </Label>
            </label>
          ))}
        </RadioGroup>
      </CardContent>
    </Card>
  );
}
