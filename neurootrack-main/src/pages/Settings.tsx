import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Save, LogOut, Trash2 } from 'lucide-react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { getProfile, saveProfile } from '@/lib/storage';

export default function Settings() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    if (!localStorage.getItem('neurotrack_auth')) { navigate('/auth?mode=login'); return; }
    const p = getProfile();
    setName(p.name);
    setEmail(p.email);
  }, [navigate]);

  const handleSave = () => {
    saveProfile({ name, email });
    toast({ title: 'Profile updated', description: 'Your changes have been saved.' });
  };

  const handleLogout = () => {
    localStorage.removeItem('neurotrack_auth');
    navigate('/');
  };

  const handleClearData = () => {
    if (window.confirm('Are you sure? This will delete all your headache data. This action cannot be undone.')) {
      localStorage.removeItem('neurotrack_entries');
      localStorage.removeItem('neurotrack_predictions');
      toast({ title: 'Data cleared', description: 'All headache data has been deleted.' });
    }
  };

  return (
    <Layout>
      <div className="max-w-xl mx-auto space-y-6">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground mt-1">Manage your profile and preferences</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <User className="h-4 w-4" /> Profile
            </CardTitle>
            <CardDescription>Update your personal information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" value={name} onChange={e => setName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} />
            </div>
            <Button onClick={handleSave} className="gradient-primary border-0">
              <Save className="h-4 w-4 mr-2" /> Save Changes
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base text-destructive">Danger Zone</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" onClick={handleClearData} className="w-full border-destructive/30 text-destructive hover:bg-destructive/5">
              <Trash2 className="h-4 w-4 mr-2" /> Clear All Headache Data
            </Button>
            <Button variant="outline" onClick={handleLogout} className="w-full">
              <LogOut className="h-4 w-4 mr-2" /> Sign Out
            </Button>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
