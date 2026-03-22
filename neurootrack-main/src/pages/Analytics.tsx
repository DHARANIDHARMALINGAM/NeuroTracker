import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getEntries, getPredictions } from '@/lib/storage';
import { supabase } from '@/lib/supabase';
import type { HeadLocation, PainType, Symptom, RiskLevel, HeadacheType } from '@/types/headache';
import type { HeadacheEntry, PredictionResult } from '@/types/headache';
import { HEADACHE_TYPE_LABELS, TRIGGER_LABELS, type Trigger } from '@/types/headache';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['hsl(217,91%,60%)', 'hsl(168,76%,32%)', 'hsl(38,92%,50%)', 'hsl(0,84%,60%)'];

export default function Analytics() {
  const navigate = useNavigate();
  const [entries, setEntries] = useState<HeadacheEntry[]>([]);
  const [predictions, setPredictions] = useState<PredictionResult[]>([]);
  const [view, setView] = useState<'weekly' | 'monthly'>('weekly');

  useEffect(() => {
    const fetchData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/auth?mode=login');
        return;
      }

      const { data: dbData, error } = await supabase
        .from('headache_history')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching entries:', error);
        return;
      }

      if (dbData) {
        const mappedEntries: HeadacheEntry[] = dbData.map(row => ({
          id: row.id,
          user_id: row.user_id,
          date: (row.created_at || new Date().toISOString()).split('T')[0],
          time: new Date(row.created_at || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          intensity: row.intensity,
          location: (row.location?.toLowerCase().includes('front') ? 'front' : 
                     row.location?.toLowerCase().includes('side') ? 'side' : 
                     row.location?.toLowerCase().includes('back') ? 'back' : 'whole') as HeadLocation,
          pain_type: (row.character?.toLowerCase().includes('throbbing') ? 'throbbing' : 
                      row.character?.toLowerCase().includes('stabbing') ? 'stabbing' : 'pressure') as PainType,
          duration_minutes: (row.duration || 1) * 60,
          symptoms: [
            ...(row.nausea ? ['nausea'] : []),
            ...(row.vomiting ? ['vomiting'] : []),
            ...(row.photophobia ? ['light_sensitivity'] : []),
            ...(row.phonophobia ? ['sound_sensitivity'] : []),
            ...(row.visual_aura ? ['visual_aura'] : []),
          ] as Symptom[],
          sleep_hours: row.age || 7,
          stress_level: 5,
          hydration_level: 5,
          screen_time: 5,
          triggers: [],
          created_at: row.created_at
        }));

        const mappedPredictions: PredictionResult[] = dbData.map(row => ({
          id: row.id + '_pred',
          entry_id: row.id,
          predicted_type: row.predicted_type as HeadacheType,
          confidence: row.confidence || 0.8,
          detected_triggers: [],
          risk_level: (row.risk_level?.toLowerCase() || 'low') as RiskLevel,
          recommendations: []
        }));

        setEntries(mappedEntries);
        setPredictions(mappedPredictions);
      }
    };
    fetchData();
  }, [navigate]);

  // Frequency data
  const getFrequencyData = () => {
    if (entries.length === 0) return [];
    const grouped: Record<string, number> = {};
    entries.forEach(e => {
      const d = new Date(e.date);
      const key = view === 'weekly'
        ? `W${Math.ceil(d.getDate() / 7)} ${d.toLocaleString('default', { month: 'short' })}`
        : d.toLocaleString('default', { month: 'short', year: '2-digit' });
      grouped[key] = (grouped[key] || 0) + 1;
    });
    return Object.entries(grouped).map(([name, count]) => ({ name, count })).slice(-12);
  };

  // Severity trend
  const severityData = entries.slice().reverse().slice(-20).map((e, i) => ({
    name: `#${i + 1}`,
    severity: e.intensity,
  }));

  // Type distribution
  const typeDistribution = () => {
    const counts: Record<string, number> = {};
    predictions.forEach(p => {
      const label = HEADACHE_TYPE_LABELS[p.predicted_type];
      counts[label] = (counts[label] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  };

  // Trigger frequency
  const triggerData = () => {
    const counts: Record<string, number> = {};
    entries.forEach(e => {
      e.triggers.forEach(t => {
        const label = TRIGGER_LABELS[t as Trigger] || t;
        counts[label] = (counts[label] || 0) + 1;
      });
    });
    return Object.entries(counts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  };

  // Calendar heatmap
  const calendarData = () => {
    const map: Record<string, number> = {};
    entries.forEach(e => {
      map[e.date] = (map[e.date] || 0) + 1;
    });
    const days: { date: string; count: number; dayOfWeek: number }[] = [];
    const now = new Date();
    for (let i = 89; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const key = d.toISOString().split('T')[0];
      days.push({ date: key, count: map[key] || 0, dayOfWeek: d.getDay() });
    }
    return days;
  };

  if (entries.length === 0) {
    return (
      <Layout>
        <div className="text-center py-20">
          <h1 className="font-display text-2xl font-bold mb-2">Analytics</h1>
          <p className="text-muted-foreground mb-4">Log some headaches first to see your analytics.</p>
          <Button onClick={() => navigate('/tracker')}>Log Headache</Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold">Analytics Dashboard</h1>
          <p className="text-muted-foreground mt-1">Visual insights from your headache data</p>
        </div>

        {/* Frequency */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base">Headache Frequency</CardTitle>
            <div className="flex gap-1">
              <Button size="sm" variant={view === 'weekly' ? 'default' : 'outline'} onClick={() => setView('weekly')}>Weekly</Button>
              <Button size="sm" variant={view === 'monthly' ? 'default' : 'outline'} onClick={() => setView('monthly')}>Monthly</Button>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={getFrequencyData()}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="name" className="text-xs" tick={{ fill: 'hsl(215,16%,47%)' }} />
                <YAxis className="text-xs" tick={{ fill: 'hsl(215,16%,47%)' }} />
                <Tooltip contentStyle={{ borderRadius: '0.75rem', border: '1px solid hsl(214,32%,91%)', background: 'hsl(0,0%,100%)' }} />
                <Bar dataKey="count" fill="hsl(217,91%,60%)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Severity Trend */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Severity Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={severityData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="name" tick={{ fill: 'hsl(215,16%,47%)', fontSize: 11 }} />
                  <YAxis domain={[0, 10]} tick={{ fill: 'hsl(215,16%,47%)', fontSize: 11 }} />
                  <Tooltip contentStyle={{ borderRadius: '0.75rem', border: '1px solid hsl(214,32%,91%)' }} />
                  <Line type="monotone" dataKey="severity" stroke="hsl(38,92%,50%)" strokeWidth={2} dot={{ fill: 'hsl(38,92%,50%)' }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Type Distribution */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Headache Types</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={typeDistribution()} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={4} dataKey="value" label={({ name }) => name}>
                    {typeDistribution().map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Trigger Correlation */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Trigger Correlations</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={triggerData()} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis type="number" tick={{ fill: 'hsl(215,16%,47%)', fontSize: 11 }} />
                <YAxis type="category" dataKey="name" width={120} tick={{ fill: 'hsl(215,16%,47%)', fontSize: 11 }} />
                <Tooltip contentStyle={{ borderRadius: '0.75rem', border: '1px solid hsl(214,32%,91%)' }} />
                <Bar dataKey="count" fill="hsl(168,76%,32%)" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Calendar Heatmap */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">90-Day Calendar</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-1">
              {calendarData().map((day) => (
                <div
                  key={day.date}
                  title={`${day.date}: ${day.count} headache${day.count !== 1 ? 's' : ''}`}
                  className={`w-3 h-3 rounded-sm ${
                    day.count === 0 ? 'bg-secondary' :
                    day.count === 1 ? 'bg-primary/30' :
                    day.count === 2 ? 'bg-primary/60' :
                    'bg-primary'
                  }`}
                />
              ))}
            </div>
            <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground">
              <span>Less</span>
              <div className="w-3 h-3 rounded-sm bg-secondary" />
              <div className="w-3 h-3 rounded-sm bg-primary/30" />
              <div className="w-3 h-3 rounded-sm bg-primary/60" />
              <div className="w-3 h-3 rounded-sm bg-primary" />
              <span>More</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
