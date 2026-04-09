import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Brain, ShieldCheck, Lightbulb, Heart, Droplets, Moon,
  Monitor, Utensils, HelpCircle, ChevronDown, ChevronUp,
  Activity, Zap, Clock, Eye
} from 'lucide-react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

/* ── Headache type data ─────────────────────────────────── */
const headacheTypes = [
  {
    name: 'Migraine with Aura',
    icon: Eye,
    color: 'text-purple-500',
    bg: 'bg-purple-500/10 border-purple-500/20',
    description:
      'Visual disturbances like flashing lights, zigzag patterns, or blind spots appear 20–60 minutes before the headache. Often accompanied by nausea and extreme light sensitivity.',
    keySymptoms: ['Visual aura', 'One-sided pain', 'Nausea', 'Light sensitivity'],
    duration: '4 – 72 hours',
  },
  {
    name: 'Migraine without Aura',
    icon: Zap,
    color: 'text-red-500',
    bg: 'bg-red-500/10 border-red-500/20',
    description:
      'The most common migraine type — moderate-to-severe throbbing pain, usually on one side of the head, worsened by physical activity.',
    keySymptoms: ['Throbbing pain', 'Sound sensitivity', 'Nausea / vomiting', 'Fatigue'],
    duration: '4 – 72 hours',
  },
  {
    name: 'Tension-Type Headache',
    icon: Activity,
    color: 'text-blue-500',
    bg: 'bg-blue-500/10 border-blue-500/20',
    description:
      'Feels like a tight band around the head. Usually mild-to-moderate and doesn\'t worsen with routine physical activity.',
    keySymptoms: ['Pressing pain', 'Both sides', 'Mild intensity', 'No nausea'],
    duration: '30 min – 7 days',
  },
  {
    name: 'Cluster Headache',
    icon: Clock,
    color: 'text-amber-500',
    bg: 'bg-amber-500/10 border-amber-500/20',
    description:
      'Extremely intense pain around one eye, occurring in cyclical patterns ("clusters"). Often wakes patients from sleep.',
    keySymptoms: ['Severe eye pain', 'Tearing / redness', 'Restlessness', 'Nasal congestion'],
    duration: '15 min – 3 hours',
  },
];

/* ── Prevention tips ────────────────────────────────────── */
const preventionTips = [
  {
    icon: Moon,
    title: 'Prioritise Sleep',
    description: 'Stick to a consistent sleep schedule — even on weekends. 7–9 hours is ideal.',
    color: 'text-indigo-500',
  },
  {
    icon: Droplets,
    title: 'Stay Hydrated',
    description: 'Dehydration is a top trigger. Aim for 2–3 litres of water per day.',
    color: 'text-cyan-500',
  },
  {
    icon: Heart,
    title: 'Manage Stress',
    description: 'Practise deep breathing, yoga, or short walks to keep stress hormones in check.',
    color: 'text-rose-500',
  },
  {
    icon: Monitor,
    title: 'Limit Screen Time',
    description: 'The blue light from screens can trigger migraines. Take a 5-minute break every 30 minutes.',
    color: 'text-violet-500',
  },
  {
    icon: Utensils,
    title: 'Eat Regularly',
    description: 'Skipping meals causes blood-sugar dips that can trigger headaches. Keep healthy snacks handy.',
    color: 'text-emerald-500',
  },
  {
    icon: Activity,
    title: 'Exercise Moderately',
    description: 'Regular aerobic exercise (30 min, 3× per week) can reduce migraine frequency by up to 40 %.',
    color: 'text-orange-500',
  },
];

/* ── FAQ data ───────────────────────────────────────────── */
const faqs = [
  {
    question: 'How accurate is NeuroTrack AI?',
    answer:
      'Our AI model achieves over 88 % accuracy in clinical validation tests. It continuously improves as more anonymised data is collected. However, it is a screening tool — always consult a neurologist for a formal diagnosis.',
  },
  {
    question: 'Is my health data safe?',
    answer:
      'Yes. All data is encrypted at rest and in transit. We follow industry-standard security practices and never share individual patient data with third parties.',
  },
  {
    question: 'When should I see a doctor?',
    answer:
      'You should seek immediate medical attention if: you experience the worst headache of your life, a headache after head injury, headache with fever / stiff neck, sudden vision loss, or if your headache pattern changes dramatically.',
  },
  {
    question: 'Can logging headaches really help?',
    answer:
      'Absolutely. Consistent logging helps our AI identify your personal triggers, seasonal patterns, and the effectiveness of lifestyle changes — insights that would take months to discover on your own.',
  },
  {
    question: 'What data does the AI use to make predictions?',
    answer:
      'The model analyses your symptom profile (pain intensity, location, type, duration), associated symptoms (nausea, aura, light sensitivity), and lifestyle factors (sleep, stress, hydration, screen time) to classify your headache type and assess risk.',
  },
];

/* ── Component ──────────────────────────────────────────── */
export default function HealthGuide() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <Layout>
      <div className="max-w-5xl mx-auto space-y-10 pb-20">
        {/* ── Header ── */}
        <div className="space-y-1">
          <h1 className="font-display text-3xl md:text-4xl font-bold tracking-tight">
            Health Guide
          </h1>
          <p className="text-muted-foreground text-lg">
            Learn about headache types, prevention strategies, and how our AI helps you.
          </p>
        </div>

        {/* ── Understanding Headache Types ── */}
        <section className="space-y-4">
          <h2 className="font-display text-xl font-semibold flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            Understanding Headache Types
          </h2>
          <p className="text-sm text-muted-foreground max-w-2xl">
            Our AI classifies your headaches into four categories based on internationally
            recognised medical criteria. Here's what each type means:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {headacheTypes.map((type, i) => (
              <motion.div
                key={type.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
              >
                <Card className={`h-full border ${type.bg}`}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center gap-2">
                      <type.icon className={`h-5 w-5 ${type.color}`} />
                      {type.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {type.description}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {type.keySymptoms.map(s => (
                        <Badge key={s} variant="secondary" className="text-[11px]">
                          {s}
                        </Badge>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      <span className="font-semibold">Typical duration:</span> {type.duration}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── Prevention Tips ── */}
        <section className="space-y-4">
          <h2 className="font-display text-xl font-semibold flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-primary" />
            Prevention &amp; Wellness Tips
          </h2>
          <p className="text-sm text-muted-foreground max-w-2xl">
            Small daily habits can significantly reduce your headache frequency.
            Here are evidence-based strategies:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {preventionTips.map((tip, i) => (
              <motion.div
                key={tip.title}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
              >
                <Card className="h-full hover:shadow-md transition-shadow">
                  <CardContent className="pt-6 space-y-2">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-lg bg-primary/5 flex items-center justify-center">
                        <tip.icon className={`h-5 w-5 ${tip.color}`} />
                      </div>
                      <p className="font-semibold text-sm">{tip.title}</p>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {tip.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── How our AI works ── */}
        <section className="space-y-4">
          <h2 className="font-display text-xl font-semibold flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-primary" />
            How Our AI Works
          </h2>

          <Card className="border-primary/20 bg-primary/[0.03]">
            <CardContent className="p-6 md:p-8">
              <div className="grid md:grid-cols-3 gap-6 text-center">
                {[
                  {
                    step: '1',
                    title: 'You Log Symptoms',
                    desc: 'Record your pain intensity, location, duration, and associated symptoms using our simple tracker.',
                  },
                  {
                    step: '2',
                    title: 'AI Analyses Patterns',
                    desc: 'Our clinically-validated machine learning model compares your profile against thousands of cases to classify your headache.',
                  },
                  {
                    step: '3',
                    title: 'You Get Insights',
                    desc: 'Receive a diagnosis forecast, risk assessment, and personalised recommendations — all in seconds.',
                  },
                ].map((item, i) => (
                  <motion.div
                    key={item.step}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 + i * 0.12 }}
                    className="space-y-2"
                  >
                    <div className="mx-auto h-10 w-10 rounded-full gradient-primary flex items-center justify-center text-primary-foreground font-bold text-lg">
                      {item.step}
                    </div>
                    <p className="font-semibold text-sm">{item.title}</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {item.desc}
                    </p>
                  </motion.div>
                ))}
              </div>

              <div className="mt-8 p-4 rounded-xl bg-muted/40 border border-dashed border-muted-foreground/20">
                <p className="text-sm text-muted-foreground text-center leading-relaxed">
                  <span className="font-semibold text-foreground">Clinical note:</span>{' '}
                  NeuroTrack AI is a screening and self-management tool — it does not replace
                  professional medical advice. Always consult a qualified healthcare provider for
                  diagnosis and treatment.
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* ── FAQ ── */}
        <section className="space-y-4">
          <h2 className="font-display text-xl font-semibold flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-primary" />
            Frequently Asked Questions
          </h2>

          <div className="space-y-2">
            {faqs.map((faq, i) => {
              const isOpen = openFaq === i;
              return (
                <Card
                  key={i}
                  className={`cursor-pointer transition-colors ${isOpen ? 'border-primary/30' : ''}`}
                  onClick={() => setOpenFaq(isOpen ? null : i)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-sm pr-4">{faq.question}</p>
                      {isOpen ? (
                        <ChevronUp className="h-4 w-4 text-muted-foreground shrink-0" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
                      )}
                    </div>
                    {isOpen && (
                      <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="text-sm text-muted-foreground mt-3 leading-relaxed"
                      >
                        {faq.answer}
                      </motion.p>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>
      </div>
    </Layout>
  );
}
