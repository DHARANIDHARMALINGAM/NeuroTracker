-- Create the headache_history table
CREATE TABLE IF NOT EXISTS public.headache_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  
  -- Demographics
  age INTEGER NOT NULL,
  gender TEXT NOT NULL, -- Male, Female, Other
  
  -- Symptom Details
  duration INTEGER NOT NULL, -- in hours
  intensity INTEGER NOT NULL, -- 1-10
  location TEXT NOT NULL, -- Unilateral, Bilateral
  character TEXT NOT NULL, -- Throbbing, Constant, Stabbing
  
  -- Associated Symptoms (Boolean)
  nausea BOOLEAN DEFAULT false,
  vomiting BOOLEAN DEFAULT false,
  phonophobia BOOLEAN DEFAULT false,
  photophobia BOOLEAN DEFAULT false,
  visual_aura BOOLEAN DEFAULT false,
  sensory_aura BOOLEAN DEFAULT false,
  dysphasia BOOLEAN DEFAULT false,
  vertigo BOOLEAN DEFAULT false,
  
  -- Prediction Results
  predicted_type TEXT,
  confidence FLOAT, -- If available from model
  risk_level TEXT, -- low, moderate, high, severe
  
  -- Metadata
  actual_type TEXT -- For potential retraining feedback
);

-- Basic RLS (Row Level Security)
ALTER TABLE public.headache_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert their own entries" 
ON public.headache_history FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own entries" 
ON public.headache_history FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own entries" 
ON public.headache_history FOR UPDATE USING (auth.uid() = user_id);
