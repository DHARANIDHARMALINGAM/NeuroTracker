import { useState, useMemo } from 'react';
import { 
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  AreaChart, Area, PieChart, Pie, Cell, ScatterChart, Scatter, ZAxis
} from 'recharts';
import { 
  Calendar, TrendingUp, AlertCircle, Clock, Thermometer,
  Zap, Droplets, Moon, Monitor, Network, Activity
} from 'lucide-react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Mock data for analytics
const severityData = [
  { day: 'Mon', intensity: 4, stress: 5 },
  { day: 'Tue', intensity: 2, stress: 3 },
  { day: 'Wed', intensity: 8, stress: 9 },
  { day: 'Thu', intensity: 5, stress: 6 },
  { day: 'Fri', intensity: 3, stress: 4 },
  { day: 'Sat', intensity: 1, stress: 2 },
  { day: 'Sun', intensity: 6, stress: 7 },
];

const triggerCorrelation = [
  { name: 'Lack of Sleep', correlation: 0.74, color: '#ef4444' },
  { name: 'Stress', correlation: 0.68, color: '#f59e0b' },
  { name: 'Dehydration', correlation: 0.45, color: '#3b82f6' },
  { name: 'Screen Time', correlation: 0.32, color: '#8b5cf6' },
];

const timeDistribution = [
  { time: 'Morning (6AM-12PM)', count: 12, fill: '#3b82f6' },
  { time: 'Afternoon (12PM-6PM)', count: 25, fill: '#f59e0b' },
  { time: 'Evening (6PM-12AM)', count: 48, fill: '#8b5cf6' },
  { time: 'Night (12AM-6AM)', count: 15, fill: '#64748b' },
];

const monthlyFrequency = [
  { month: 'Jan', count: 4 },
  { month: 'Feb', count: 6 },
  { month: 'Mar', count: 12 },
  { month: 'Apr', count: 8 },
  { month: 'May', count: 5 },
  { month: 'Jun', count: 3 },
];

export default function Analytics() {
  const [timeRange, setTimeRange] = useState('30days');

  return (
    <Layout>
      <div className="max-w-6xl mx-auto space-y-8 pb-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-1">
            <h1 className="font-display text-3xl md:text-4xl font-bold tracking-tight">Health Analytics</h1>
            <p className="text-muted-foreground text-lg">Statistical patterns and medical insights from your records.</p>
          </div>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 Days</SelectItem>
              <SelectItem value="30days">Last 30 Days</SelectItem>
              <SelectItem value="90days">Last 90 Days</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Top Level Insights */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-4 w-4 text-primary" />
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Monthly Avg</span>
              </div>
              <p className="text-3xl font-bold">6.4 <span className="text-sm font-normal text-muted-foreground">episodes</span></p>
            </CardContent>
          </Card>
          <Card className="bg-destructive/5 border-destructive/20">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="h-4 w-4 text-destructive" />
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Main Trigger</span>
              </div>
              <p className="text-3xl font-bold">Sleep <span className="text-sm font-normal text-muted-foreground">0.74 corr</span></p>
            </CardContent>
          </Card>
          <Card className="bg-purple-50 border-purple-100">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-4 w-4 text-purple-600" />
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Peak Time</span>
              </div>
              <p className="text-3xl font-bold">8PM - 11PM</p>
            </CardContent>
          </Card>
          <Card className="bg-blue-50 border-blue-100">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="h-4 w-4 text-blue-600" />
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Cycle Detection</span>
              </div>
              <p className="text-3xl font-bold">5.2 <span className="text-sm font-normal text-muted-foreground">days</span></p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Severity vs Factor Over Time */}
          <Card>
            <CardHeader>
              <CardTitle>Severity vs. Stress Pattern</CardTitle>
              <CardDescription>Identifying temporal relationships between lifestyle factors and pain.</CardDescription>
            </CardHeader>
            <CardContent className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={severityData}>
                  <defs>
                    <linearGradient id="colorIntensity" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="intensity" stroke="#3b82f6" fillOpacity={1} fill="url(#colorIntensity)" name="Intensity" />
                  <Line type="monotone" dataKey="stress" stroke="#ef4444" dot={true} name="Stress Level" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Trigger Correlation Ranking */}
          <Card>
            <CardHeader>
              <CardTitle>Trigger Correlation Engine</CardTitle>
              <CardDescription>Statistical relationship between your habits and migraines.</CardDescription>
            </CardHeader>
            <CardContent className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={triggerCorrelation} layout="vertical" margin={{ left: 40 }}>
                   <XAxis type="number" domain={[0, 1]} />
                   <YAxis dataKey="name" type="category" stroke="#64748b" />
                   <Tooltip />
                   <Bar dataKey="correlation" radius={[0, 4, 4, 0]}>
                     {triggerCorrelation.map((entry, index) => (
                       <Cell key={`cell-${index}`} fill={entry.color} />
                     ))}
                   </Bar>
                </BarChart>
              </ResponsiveContainer>
              <div className="mt-4 p-4 bg-muted/30 rounded-xl border-2 border-dashed border-muted text-center italic">
                <p className="text-sm text-muted-foreground">
                  Insight: Improving sleep duration by 1 hour could reduce frequency by 15%.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Diurnal Pattern Analysis */}
          <Card>
            <CardHeader>
              <CardTitle>Time-of-Day Distribution</CardTitle>
              <CardDescription>Aggregated frequency analysis for identifying circadian triggers.</CardDescription>
            </CardHeader>
            <CardContent className="h-[350px] flex items-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={timeDistribution}
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="count"
                  >
                    {timeDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Monthly Trend Forecast */}
          <Card>
            <CardHeader>
              <CardTitle>Monthly Migraine Distribution</CardTitle>
              <CardDescription>Identifying seasonal variations and multi-month trends.</CardDescription>
            </CardHeader>
            <CardContent className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyFrequency}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Risk Prediction Banner */}
        <Card className="bg-gradient-to-r from-primary to-blue-600 text-white overflow-hidden relative">
          <div className="absolute right-0 top-0 h-full w-1/3 opacity-10 flex items-center justify-center">
             <Activity className="h-40 w-40 -mr-10" />
          </div>
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="h-24 w-24 rounded-full border-4 border-white/20 flex items-center justify-center bg-white/10 shrink-0">
                <p className="text-3xl font-bold">78%</p>
              </div>
              <div className="space-y-2 flex-1 text-center md:text-left">
                <h3 className="text-2xl font-bold">High Risk Probability Predicted</h3>
                <p className="text-primary-foreground/90 max-w-xl">
                  Based on your increasing stress (9/10) and low sleep (5h) in the last 48 hours, our AI predicts a high risk of migraine within the next 24 hours.
                </p>
                <div className="flex flex-wrap gap-2 pt-2 justify-center md:justify-start">
                   <Badge className="bg-white text-primary hover:bg-white/90 cursor-default">Prevention Mode Active</Badge>
                   <Badge variant="outline" className="text-white border-white/30 cursor-default">Avoid Caffeine</Badge>
                   <Badge variant="outline" className="text-white border-white/30 cursor-default">Sleep Early</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
