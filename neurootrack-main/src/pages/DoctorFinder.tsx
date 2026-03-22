import { motion } from 'framer-motion';
import { Stethoscope, Phone, MapPin, Clock, ExternalLink } from 'lucide-react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const doctors = [
  { name: 'Dr. Sarah Chen', specialty: 'Neurologist', location: 'Downtown Medical Center', phone: '(555) 123-4567', hours: 'Mon-Fri 9AM-5PM', rating: 4.9 },
  { name: 'Dr. Michael Rivera', specialty: 'Headache Specialist', location: 'City Neurology Clinic', phone: '(555) 234-5678', hours: 'Mon-Thu 8AM-6PM', rating: 4.8 },
  { name: 'Dr. Emily Watson', specialty: 'Neurology & Pain Management', location: 'University Health System', phone: '(555) 345-6789', hours: 'Tue-Sat 10AM-4PM', rating: 4.7 },
];

export default function DoctorFinder() {
  return (
    <Layout>
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold">Find a Neurologist</h1>
          <p className="text-muted-foreground mt-1">Get professional help for your headache management</p>
        </div>

        {/* When to see a doctor */}
        <Card className="border-warning/30 bg-warning/5">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Stethoscope className="h-5 w-5 text-warning" />
              When Should You See a Doctor?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              {[
                'Headaches occur more than 15 days per month',
                'Over-the-counter medications no longer provide relief',
                'Headaches are getting progressively worse',
                'You experience visual disturbances or aura',
                'Headaches are accompanied by fever, stiff neck, or confusion',
                'Sudden, severe "thunderclap" headache',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-warning mt-0.5">•</span>
                  {item}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Doctor List */}
        <div className="space-y-4">
          {doctors.map((doc, i) => (
            <motion.div
              key={doc.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="font-display font-semibold text-lg">{doc.name}</h3>
                      <p className="text-sm text-primary font-medium">{doc.specialty}</p>
                      <div className="mt-2 space-y-1 text-sm text-muted-foreground">
                        <p className="flex items-center gap-2"><MapPin className="h-3.5 w-3.5" /> {doc.location}</p>
                        <p className="flex items-center gap-2"><Phone className="h-3.5 w-3.5" /> {doc.phone}</p>
                        <p className="flex items-center gap-2"><Clock className="h-3.5 w-3.5" /> {doc.hours}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className="text-sm font-medium">⭐ {doc.rating}</span>
                      <Button variant="outline" size="sm">
                        <ExternalLink className="h-3.5 w-3.5 mr-1" /> View Profile
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <Card>
          <CardContent className="p-6 text-center">
            <CardDescription>
              These are sample listings. In a production app, this would integrate with a real doctor directory API.
            </CardDescription>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
