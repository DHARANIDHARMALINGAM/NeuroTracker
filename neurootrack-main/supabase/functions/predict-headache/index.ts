import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

/**
 * HEADACHE PREDICTION ENGINE (SVM RBF)
 * This function implements the scikit-learn One-vs-One SVM logic in TypeScript.
 */

// We fetch parameters from a sidecar file or embed them. 
// For this implementation, we assume model_params.json is in the same directory.
import modelParams from "./model_params.json" assert { type: "json" };

const { 
  feature_names, classes, scaler, encoders, 
  kernel, gamma, support_vectors, dual_coef, intercept, n_support
} = modelParams;

const LABELS = [
  "Migraine without aura",
  "Migraine with aura",
  "Tension-type headache",
  "Cluster headache"
];

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: { 
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-client-info, apikey',
    }});
  }

  try {
    const data = await req.json();
    
    // 1. Preprocessing & Feature Engineering
    const processed: any = { ...data };
    
    // Severity Score
    processed.severity_score = (data.pain_intensity * 0.5) + (Number(data.nausea) * 2.0) + 
                               (Number(data.vomiting) * 2.5) + (Number(data.photophobia) * 1.5) + 
                               (Number(data.phonophobia) * 1.5);
    
    // Frequency Index (Heuristic max values)
    processed.frequency_index = ((data.frequency_per_month / 30) * 0.6) + ((data.duration_hours / 72) * 0.4);
    
    processed.trigger_count = [
      data.stress_level > 6, data.sleep_hours < 6, data.caffeine_intake > 4, 
      data.alcohol_intake > 3, data.weather_sensitivity, data.hormonal_factor, 
      data.screen_time > 8
    ].filter(Boolean).length;
    
    processed.symptom_count = [
      data.nausea, data.vomiting, data.photophobia, data.phonophobia, 
      data.aura_present, data.visual_disturbance
    ].filter(Boolean).length;

    // 2. Encoding & Scaling
    const X_raw: number[] = [];
    for (const name of feature_names) {
      let val = processed[name];
      if (encoders[name]) {
        const idx = encoders[name].indexOf(val);
        val = idx !== -1 ? idx : 0;
      }
      X_raw.push(Number(val));
    }

    const scaleCols = ["age", "pain_intensity", "duration_hours", "stress_level", "sleep_hours", 
                       "caffeine_intake", "alcohol_intake", "screen_time", "frequency_per_month",
                       "severity_score", "frequency_index", "trigger_count", "symptom_count"];
    
    const X_scaled = X_raw.map((v, i) => {
      const scalerIdx = scaleCols.indexOf(feature_names[i]);
      if (scalerIdx !== -1) {
        return (v - scaler.mean[scalerIdx]) / scaler.scale[scalerIdx];
      }
      return v;
    });

    // 3. SVM RBF Kernel Inference
    const rbf = (v1: number[], v2: number[]) => {
      let distSq = 0;
      for (let i = 0; i < v1.length; i++) {
        distSq += Math.pow(v1[i] - v2[i], 2);
      }
      return Math.exp(-gamma * distSq);
    };

    const nClasses = classes.length;
    const kValues = support_vectors.map((sv: number[]) => rbf(sv, X_scaled));
    
    // Calculate decision functions for all pairs (i, j)
    const votes = new Array(nClasses).fill(0);
    let interceptIdx = 0;
    
    // Support vector indices per class
    const startSV = new Array(nClasses).fill(0);
    for (let i = 1; i < nClasses; i++) {
      startSV[i] = startSV[i-1] + n_support[i-1];
    }

    for (let i = 0; i < nClasses; i++) {
      for (let j = i + 1; j < nClasses; j++) {
        let sum = 0;
        
        // SVs from class i
        for (let k = 0; k < n_support[i]; k++) {
          const svIdx = startSV[i] + k;
          sum += dual_coef[j - 1][svIdx] * kValues[svIdx];
        }
        
        // SVs from class j
        for (let k = 0; k < n_support[j]; k++) {
          const svIdx = startSV[j] + k;
          sum += dual_coef[i][svIdx] * kValues[svIdx];
        }
        
        sum += intercept[interceptIdx++];
        
        if (sum > 0) votes[i]++;
        else votes[j]++;
      }
    }

    const predictedClassIdx = votes.indexOf(Math.max(...votes));
    const predictionIdx = classes[predictedClassIdx];
    
    // Calculate Confidence Score (%)
    const totalVotes = votes.reduce((a, b) => a + b, 0);
    const confidence = Math.round((votes[predictedClassIdx] / totalVotes) * 100);

    // Calculate Risk Level (Rule-based for now)
    let riskLevel = 'low';
    if (data.pain_intensity >= 8 || data.duration_hours > 24) riskLevel = 'severe';
    else if (data.pain_intensity >= 6 || data.vomiting) riskLevel = 'high';
    else if (data.pain_intensity >= 4) riskLevel = 'moderate';

    return new Response(
      JSON.stringify({ 
        prediction: LABELS[predictionIdx],
        prediction_index: predictionIdx,
        confidence: confidence,
        risk_level: riskLevel,
        votes: votes
      }),
      { 
        headers: { 
          "Content-Type": "application/json",
          'Access-Control-Allow-Origin': '*'
        } 
      }
    );
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json", 'Access-Control-Allow-Origin': '*' },
    });
  }
});
