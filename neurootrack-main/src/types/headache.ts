export type HeadLocation = 'front' | 'side' | 'back' | 'whole';
export type PainType = 'throbbing' | 'pressure' | 'stabbing';
export type Symptom = 'nausea' | 'vomiting' | 'light_sensitivity' | 'sound_sensitivity' | 'visual_aura';
export type Trigger = 'lack_of_sleep' | 'dehydration' | 'stress' | 'weather_change';

export interface HeadacheEntry {
  id: string;
  user_id: string;
  date: string;
  time: string;
  intensity: number;
  location: HeadLocation;
  pain_type: PainType;
  duration_minutes: number;
  symptoms: Symptom[];
  sleep_hours: number;
  stress_level: number;
  hydration_level: number;
  screen_time: number;
  triggers: Trigger[];
  created_at: string;
}

export type HeadacheType = 'migraine_with_aura' | 'migraine_without_aura' | 'tension' | 'cluster';

export type RiskLevel = 'low' | 'moderate' | 'high' | 'severe';

export interface PredictionResult {
  id: string;
  entry_id: string;
  predicted_type: HeadacheType;
  confidence: number;
  detected_triggers: string[];
  risk_level: RiskLevel;
  recommendations: string[];
}

export interface Insight {
  id: string;
  icon: string;
  title: string;
  description: string;
  type: 'info' | 'warning' | 'success';
}

export const HEADACHE_TYPE_LABELS: Record<HeadacheType, string> = {
  migraine_with_aura: 'Migraine with Aura',
  migraine_without_aura: 'Migraine without Aura',
  tension: 'Tension Headache',
  cluster: 'Cluster Headache',
};

export const RISK_LEVEL_LABELS: Record<RiskLevel, string> = {
  low: 'Low Risk',
  moderate: 'Moderate Risk',
  high: 'High Risk',
  severe: 'Severe Risk',
};

export const SYMPTOM_LABELS: Record<Symptom, string> = {
  nausea: 'Nausea',
  vomiting: 'Vomiting',
  light_sensitivity: 'Light Sensitivity',
  sound_sensitivity: 'Sound Sensitivity',
  visual_aura: 'Visual Aura',
};

export const TRIGGER_LABELS: Record<Trigger, string> = {
  lack_of_sleep: 'Lack of Sleep',
  dehydration: 'Dehydration',
  stress: 'Stress',
  weather_change: 'Weather Change',
};

export const LOCATION_LABELS: Record<HeadLocation, string> = {
  front: 'Front',
  side: 'Side',
  back: 'Back',
  whole: 'Whole Head',
};

export const PAIN_TYPE_LABELS: Record<PainType, string> = {
  throbbing: 'Throbbing',
  pressure: 'Pressure',
  stabbing: 'Stabbing',
};
