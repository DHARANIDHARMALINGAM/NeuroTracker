import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Brain, AlertTriangle, CheckCircle, ArrowRight, Lightbulb, Loader2 } from 'lucide-react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { HEADACHE_TYPE_LABELS, RISK_LEVEL_LABELS } from '@/types/headache';
import type { HeadacheEntry, PredictionResult, RiskLevel, HeadacheType } from '@/types/headache';

export default function PredictionResults() {
  const { entryId } = useParams();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('headache_history')
          .select('*')
          .eq('id', entryId)
          .single();
        
        if (error) throw error;
        setData(data);
      } catch (error) {
        console.error('Error fetching prediction:', error);
      } finally {
        setLoading(false);
      }
    };
    if (entryId) fetchData();
  }, [entryId]);

  if (loading) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
          <p className="text-muted-foreground">Analyzing your results...</p>
        </div>
      </Layout>
    );
  }

  if (!data) {
    return (
      <Layout>
        <div className="text-center py-20">
          <p className="text-muted-foreground">Prediction not found.</p>
          <Link to="/tracker"><Button className="mt-4">Back to Tracker</Button></Link>
        </div>
      </Layout>
    );
  }

  const typeDescriptions: Record<string, string> = {
    'Migraine with aura': 'Migraines with aura involve visual disturbances like flashing lights or blind spots before the headache begins.',
    'Migraine without aura': 'Migraines without aura feature moderate-to-severe throbbing pain, often with nausea and sensitivity to light or sound.',
    'Tension-type headache': 'Tension headaches cause a dull, aching sensation with pressure around the forehead or back of the head.',
    'Cluster headache': 'Cluster headaches are extremely painful, occurring in cyclical patterns with severe pain around one eye.',
  };

  const riskColors: Record<string, string> = {
    low: 'bg-green-500/10 text-green-500 border-green-500/30',
    moderate: 'bg-blue-500/10 text-blue-500 border-blue-500/30',
    high: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/30',
    severe: 'bg-red-500/10 text-red-500 border-red-500/30',
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200 }}
            className="inline-flex items-center justify-center gradient-primary rounded-full p-4 mb-4"
          >
            <Brain className="h-8 w-8 text-primary-foreground" />
          </motion.div>
          <h1 className="font-display text-2xl md:text-3xl font-bold">AI Analysis Complete</h1>
          <p className="text-muted-foreground mt-1">
            Based on your symptoms from {new Date(data.created_at).toLocaleDateString()}
          </p>
        </div>

        {/* Predicted Type */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="border-2 border-primary/20">
            <CardContent className="p-6 text-center">
              <p className="text-sm text-muted-foreground mb-1">Predicted Headache Type</p>
              <h2 className="font-display text-2xl font-bold text-primary mb-2">
                {data.predicted_type}
              </h2>
              <p className="text-sm text-muted-foreground max-w-md mx-auto">
                {typeDescriptions[data.predicted_type] || 'Consult a specialist for more information.'}
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Confidence & Risk */}
        <div className="grid grid-cols-2 gap-4">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-sm text-muted-foreground mb-2">Confidence Score</p>
                <div className="relative w-20 h-20 mx-auto mb-2">
                  <svg viewBox="0 0 100 100" className="transform -rotate-90">
                    <circle cx="50" cy="50" r="40" stroke="currentColor" className="text-secondary" strokeWidth="8" fill="none" />
                    <circle cx="50" cy="50" r="40" stroke="currentColor" className="text-primary" strokeWidth="8" fill="none"
                      strokeDasharray={`${(data.confidence || 0) * 2.51} 251`} strokeLinecap="round" />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center font-display font-bold text-lg">
                    {Math.round(data.confidence || 0)}%
                  </span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-sm text-muted-foreground mb-2">Risk Level</p>
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-semibold ${riskColors[data.risk_level] || riskColors.low}`}>
                  {data.risk_level === 'high' || data.risk_level === 'severe' ? (
                    <AlertTriangle className="h-4 w-4" />
                  ) : (
                    <CheckCircle className="h-4 w-4" />
                  )}
                  {data.risk_level?.toUpperCase() || 'LOW'}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Recommendations */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Lightbulb className="h-4 w-4 text-primary" />
                Next Steps
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-start gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                  Consult a doctor to verify this AI analysis.
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                  Continue logging your headaches to improve accuracy.
                </li>
                {data.intensity > 7 && (
                  <li className="flex items-start gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                    High intensity noted. Seek immediate medical attention if pain worsens.
                  </li>
                )}
              </ul>
            </CardContent>
          </Card>
        </motion.div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link to="/analytics" className="flex-1">
            <Button variant="outline" className="w-full">
              View Analytics <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </Link>
          <Link to="/tracker" className="flex-1">
            <Button className="w-full gradient-primary border-0">
              Log Another
            </Button>
          </Link>
        </div>
      </div>
    </Layout>
  );
}
