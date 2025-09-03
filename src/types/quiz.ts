"use client";
export type Trait =
  | "adventure"
  | "romance"
  | "comedy"
  | "drama"
  | "thriller"
  | "animation"
  | "sciFi";

export interface AnswerOption {
  id: string;
  label: string;
  weight: Partial<Record<Trait, number>>;
}

export interface Question {
  id: string;
  text: string;
  options: AnswerOption[];
}

export interface TMDbMovie {
  id: number;
  title: string;
  release_date?: string;
  overview?: string;
  poster_path?: string | null;
  vote_average?: number;
}
