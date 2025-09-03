import { Question } from "@/types/quiz";

export const QUESTIONS: Question[] = [
  {
    id: "mood",
    text: "الان حال و هوات به کدوم نزدیک‌تره؟",
    options: [
      {
        id: "energetic",
        label: "انرژی دارم و دنبال هیجانم",
        weight: { adventure: 2, thriller: 1, sciFi: 1 },
      },
      {
        id: "cozy",
        label: "آرام و خلوت، یه چیز احساسی",
        weight: { romance: 2, drama: 1 },
      },
      {
        id: "laugh",
        label: "می‌خوام بخندم!",
        weight: { comedy: 2, animation: 1 },
      },
      {
        id: "curious",
        label: "یه چیزی فکری/مرموز",
        weight: { thriller: 2, drama: 1 },
      },
    ],
  },
  {
    id: "pace",
    text: "ریتم فیلم؟",
    options: [
      {
        id: "fast",
        label: "تند و پرحادثه",
        weight: { adventure: 2, thriller: 1 },
      },
      { id: "medium", label: "متعادل", weight: { drama: 1, comedy: 1 } },
      { id: "slow", label: "کند و عمیق", weight: { drama: 2, romance: 1 } },
    ],
  },
  {
    id: "world",
    text: "فضای داستان کجا باشه؟",
    options: [
      {
        id: "real",
        label: "واقع‌گرایانه",
        weight: { drama: 1, romance: 1, comedy: 1 },
      },
      {
        id: "fantasy",
        label: "فانتزی/علمی‌تخیلی",
        weight: { sciFi: 2, animation: 1, adventure: 1 },
      },
      { id: "dark", label: "تیره و اسرارآمیز", weight: { thriller: 2 } },
    ],
  },
  {
    id: "company",
    text: "با کی می‌بینی؟",
    options: [
      {
        id: "partner",
        label: "با پارتنر/همسر",
        weight: { romance: 2, comedy: 1 },
      },
      {
        id: "friends",
        label: "با دوستان",
        weight: { comedy: 2, adventure: 1 },
      },
      { id: "solo", label: "تنهایی", weight: { drama: 2, thriller: 1 } },
      {
        id: "family",
        label: "با خانواده",
        weight: { animation: 2, comedy: 1 },
      },
    ],
  },
  {
    id: "length",
    text: "حوصله‌ات چقدره؟",
    options: [
      {
        id: "short",
        label: "کوتاه و جمع‌وجور",
        weight: { comedy: 1, animation: 1 },
      },
      {
        id: "normal",
        label: "نرمال (۹۰–۱۲۰ دقیقه)",
        weight: { romance: 1, drama: 1 },
      },
      { id: "epic", label: "بلند و史史ی!", weight: { adventure: 2, sciFi: 1 } },
    ],
  },
  {
    id: "feel",
    text: "در نهایت چه حسی می‌خوای؟",
    options: [
      {
        id: "uplift",
        label: "روحیه‌ام بره بالا",
        weight: { comedy: 1, adventure: 1, animation: 1 },
      },
      {
        id: "moved",
        label: "تأثیر احساسی/تفکر",
        weight: { drama: 2, romance: 1 },
      },
      { id: "tense", label: "هیجان و تعلیق", weight: { thriller: 2 } },
    ],
  },
  {
    id: "violence",
    text: "با صحنه‌های خشن/ترسناک اوکی هستی؟",
    options: [
      {
        id: "nope",
        label: "ترجیحاً نه",
        weight: { romance: 1, comedy: 1, animation: 1 },
      },
      {
        id: "mild",
        label: "ملایم باشه اوکی‌ام",
        weight: { drama: 1, adventure: 1 },
      },
      { id: "ok", label: "اوکی‌ام", weight: { thriller: 2 } },
    ],
  },
  {
    id: "classic",
    text: "کلاسیک دوست داری یا جدید؟",
    options: [
      {
        id: "classic",
        label: "کلاسیک‌ها جذابن",
        weight: { drama: 1, romance: 1, adventure: 1 },
      },
      {
        id: "modern",
        label: "جدید و مدرن",
        weight: { sciFi: 1, thriller: 1, comedy: 1 },
      },
      { id: "either", label: "فرقی نداره", weight: {} },
    ],
  },
];
