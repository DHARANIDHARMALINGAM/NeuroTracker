import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ScatterChart, Scatter, ZAxis
} from 'recharts';
import { 
  Database, Cpu, Activity, TrendingUp, AlertCircle, 
  FlaskConical, CheckCircle2, RefreshCw, Download
} from 'lucide-react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import modelsData from '@/lib/models_data.json';

const metricsData = Object.entries(modelsData).map(([name, data]) => ({
  name,
  Accuracy: data.accuracy,
  Precision: data.precision_score,
  Recall: data.recall_score,
  F1: data.f1_score,
}));

const featureImportance = Object.entries(modelsData['Random Forest'].feature_importances).map(([name, value]) => ({
  name: name.replace('_', ' '),
  importance: value
}));

const confusionMatrix = modelsData['Random Forest'].confusion_matrix;
const classes = ['Migraine (Aura)', 'Migraine (No Aura)', 'Tension', 'Cluster'];

export default function Research() {
  const [retraining, setRetraining] = useState(false);

  const handleRetrain = () => {
    setRetraining(true);
    setTimeout(() => {
      setRetraining(false);
    }, 3000);
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto space-y-8 pb-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-1">
            <h1 className="font-display text-3xl md:text-4xl font-bold tracking-tight">Research & AI Management</h1>
            <p className="text-muted-foreground text-lg italic">Advanced algorithm evaluation and dataset analysis dashboard.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleRetrain} disabled={retraining}>
              {retraining ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4 mr-2" />
              )}
              Retrain All Models
            </Button>
            <Button size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export Dataset
            </Button>
          </div>
        </div>

        <Tabs defaultValue="comparison" className="w-full">
          <TabsList className="grid w-full grid-cols-4 lg:w-[600px] mb-8">
            <TabsTrigger value="comparison">Model Comparison</TabsTrigger>
            <TabsTrigger value="explainability">Explainability</TabsTrigger>
            <TabsTrigger value="confusion">Confusion Matrix</TabsTrigger>
            <TabsTrigger value="dataset">Dataset Distribution</TabsTrigger>
          </TabsList>

          <TabsContent value="comparison" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Algorithm Performance Comparison</CardTitle>
                  <CardDescription>Cross-validation metrics across four different classifiers.</CardDescription>
                </CardHeader>
                <CardContent className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={metricsData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="name" />
                      <YAxis domain={[0, 1]} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0' }}
                      />
                      <Legend />
                      <Bar dataKey="Accuracy" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="F1" fill="#10b981" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="Recall" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Current Best Model</CardTitle>
                  <CardDescription>Random Forest Classifier</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-primary/5 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <CheckCircle2 className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Validation Accuracy</p>
                        <p className="text-2xl font-bold">88.2%</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-xs font-semibold uppercase text-muted-foreground">Model Status</p>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary">Production Ready</Badge>
                      <Badge variant="secondary">Inference Optimized</Badge>
                      <Badge variant="secondary">Hyperparameter Tuned</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="explainability" className="space-y-6">
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
               <Card>
                 <CardHeader>
                   <CardTitle>Global Feature Importance</CardTitle>
                   <CardDescription>Factors contributing most to headache classification (Random Forest).</CardDescription>
                 </CardHeader>
                 <CardContent className="h-[400px]">
                   <ResponsiveContainer width="100%" height="100%">
                     <BarChart data={featureImportance} layout="vertical" margin={{ left: 20 }}>
                       <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                       <XAxis type="number" domain={[0, 0.3]} />
                       <YAxis dataKey="name" type="category" width={100} />
                       <Tooltip />
                       <Bar dataKey="importance" fill="#8884d8" radius={[0, 4, 4, 0]} />
                     </BarChart>
                   </ResponsiveContainer>
                 </CardContent>
               </Card>

               <Card>
                 <CardHeader>
                   <CardTitle>Decision Sensitivity Radar</CardTitle>
                   <CardDescription>Model sensitivity to different symptom clusters.</CardDescription>
                 </CardHeader>
                 <CardContent className="h-[400px]">
                   <ResponsiveContainer width="100%" height="100%">
                     <RadarChart data={featureImportance.slice(0, 6)}>
                       <PolarGrid />
                       <PolarAngleAxis dataKey="name" />
                       <PolarRadiusAxis angle={30} domain={[0, 0.3]} />
                       <Radar
                         name="Importance"
                         dataKey="importance"
                         stroke="#8884d8"
                         fill="#8884d8"
                         fillOpacity={0.6}
                       />
                     </RadarChart>
                   </ResponsiveContainer>
                 </CardContent>
               </Card>
             </div>
          </TabsContent>

          <TabsContent value="confusion" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Confusion Matrix (Validation Set)</CardTitle>
                <CardDescription>Accuracy visualization showing where the model misclassifies symptoms.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-5 gap-2 max-w-xl mx-auto">
                  <div className="col-span-1"></div>
                  {classes.map(c => (
                    <div key={c} className="text-[10px] sm:text-xs font-bold text-center py-2 h-12 flex items-center justify-center">
                      Predicted {c.split(' ')[0]}
                    </div>
                  ))}
                  
                  {classes.map((actual, i) => (
                    <>
                      <div key={actual} className="text-[10px] sm:text-xs font-bold flex items-center justify-end pr-2 h-12">
                        Actual {actual.split(' ')[0]}
                      </div>
                      {confusionMatrix[i].map((val, j) => (
                        <div 
                          key={`${i}-${j}`} 
                          className={`h-12 flex items-center justify-center text-sm font-bold border rounded-md ${
                            i === j ? 'bg-green-100 border-green-200 text-green-700' : 'bg-red-50 border-red-100 text-red-700'
                          }`}
                        >
                          {val}
                        </div>
                      ))}
                    </>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="dataset" className="space-y-6">
             <Card>
                <CardHeader>
                  <CardTitle>High-Dimensional Feature Clusters</CardTitle>
                  <CardDescription>Visualizing symptom relationships through intensity/duration distribution.</CardDescription>
                </CardHeader>
                <CardContent className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                      <CartesianGrid />
                      <XAxis type="number" dataKey="x" name="Intensity" unit="/10" />
                      <YAxis type="number" dataKey="y" name="Duration" unit="hrs" />
                      <ZAxis type="number" dataKey="z" range={[60, 400]} name="Stress" />
                      <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                      <Legend />
                      <Scatter name="Migraine" data={Array.from({length: 20}, () => ({x: 7+Math.random()*3, y: 4+Math.random()*8, z: 5+Math.random()*5}))} fill="#ef4444" />
                      <Scatter name="Tension" data={Array.from({length: 20}, () => ({x: 3+Math.random()*4, y: 1+Math.random()*4, z: 2+Math.random()*8}))} fill="#3b82f6" />
                      <Scatter name="Cluster" data={Array.from({length: 20}, () => ({x: 9+Math.random()*1, y: 0.5+Math.random()*2, z: 4+Math.random()*3}))} fill="#f59e0b" />
                    </ScatterChart>
                  </ResponsiveContainer>
                </CardContent>
             </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
