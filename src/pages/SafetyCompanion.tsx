import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  ChevronLeft, 
  Shield,
  Phone,
  MapPin,
  Users,
  AlertTriangle,
  Navigation,
  Share2,
  Bell,
} from 'lucide-react';
import { useEV } from '@/contexts/EVContext';
import { useToast } from '@/hooks/use-toast';

const SafetyCompanion = () => {
  const navigate = useNavigate();
  const { speak } = useEV();
  const { toast } = useToast();
  const [isSharing, setIsSharing] = useState(false);

  const emergencyContacts = [
    { name: 'Police', number: '100', icon: Shield },
    { name: 'Women Helpline', number: '1091', icon: Phone },
    { name: 'Emergency', number: '112', icon: AlertTriangle },
  ];

  const handleEmergencyCall = (name: string, number: string) => {
    speak(`Calling ${name} at ${number}`);
    toast({
      title: `Calling ${name}`,
      description: `Dialing ${number}`,
      variant: 'destructive',
    });
  };

  const handleShareLocation = () => {
    setIsSharing(true);
    speak('Sharing your live location with emergency contacts');
    toast({
      title: 'Location Shared',
      description: 'Your live location is now being shared with trusted contacts',
    });
    setTimeout(() => setIsSharing(false), 3000);
  };

  const handleSafeRoute = () => {
    speak('Calculating safest route with well-lit roads and public areas');
    toast({
      title: 'Safe Route Activated',
      description: 'Route optimized for safety with well-lit paths',
    });
  };

  return (
    <div className="min-h-screen bg-background pb-6">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-card/95 backdrop-blur-lg border-b border-border">
        <div className="flex items-center gap-3 p-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/dashboard')}
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-xl font-tech font-bold">Safety Companion</h1>
            <p className="text-xs text-muted-foreground">Your safety is our priority</p>
          </div>
          <Shield className="w-6 h-6 text-primary" />
        </div>
      </div>

      <div className="p-4 space-y-4 max-w-md mx-auto">
        {/* Quick SOS */}
        <Card className="border-2 border-destructive bg-destructive/10">
          <CardContent className="p-6 text-center">
            <Button
              variant="destructive"
              size="lg"
              className="w-full h-20 text-xl font-bold animate-pulse"
              onClick={() => {
                speak('Emergency SOS activated. Alerting all emergency contacts and authorities.');
                toast({
                  title: 'SOS ACTIVATED',
                  description: 'Emergency services and contacts have been notified',
                  variant: 'destructive',
                });
              }}
            >
              <AlertTriangle className="w-8 h-8 mr-3" />
              EMERGENCY SOS
            </Button>
            <p className="text-xs text-muted-foreground mt-3">
              Press to alert emergency contacts and share location
            </p>
          </CardContent>
        </Card>

        {/* Live Location Sharing */}
        <Card className="border-2">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <MapPin className="w-5 h-5 text-accent" />
              Live Location Sharing
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              className="w-full"
              onClick={handleShareLocation}
              disabled={isSharing}
            >
              <Share2 className="w-4 h-4 mr-2" />
              {isSharing ? 'Sharing Location...' : 'Share Live Location'}
            </Button>
            <p className="text-xs text-muted-foreground">
              Share your real-time location with trusted contacts for added safety
            </p>
          </CardContent>
        </Card>

        {/* Safe Route Planning */}
        <Card className="border-2">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Navigation className="w-5 h-5 text-success" />
              Safe Route Mode
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              className="w-full"
              variant="outline"
              onClick={handleSafeRoute}
            >
              <Navigation className="w-4 h-4 mr-2" />
              Calculate Safest Route
            </Button>
            <p className="text-xs text-muted-foreground">
              Routes prioritize well-lit roads, public areas, and active charging stations
            </p>
          </CardContent>
        </Card>

        {/* Emergency Contacts */}
        <Card className="border-2">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Phone className="w-5 h-5 text-warning" />
              Emergency Contacts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {emergencyContacts.map((contact) => (
              <Button
                key={contact.number}
                variant="outline"
                className="w-full justify-start"
                onClick={() => handleEmergencyCall(contact.name, contact.number)}
              >
                <contact.icon className="w-4 h-4 mr-2" />
                {contact.name}: {contact.number}
              </Button>
            ))}
          </CardContent>
        </Card>

        {/* Safety Tips */}
        <Card className="border-2 bg-primary/5">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Bell className="w-5 h-5 text-primary" />
              Safety Tips
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex items-start gap-2">
              <Shield className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
              <p>Always inform someone of your travel plans and expected arrival time</p>
            </div>
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
              <p>Choose charging stations in well-lit, populated areas</p>
            </div>
            <div className="flex items-start gap-2">
              <Phone className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
              <p>Keep your phone charged and emergency contacts easily accessible</p>
            </div>
          </CardContent>
        </Card>

        {/* Trusted Contacts */}
        <Card className="border-2">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Users className="w-5 h-5 text-accent" />
              Trusted Contacts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">
              <Users className="w-4 h-4 mr-2" />
              Manage Trusted Contacts
            </Button>
            <p className="text-xs text-muted-foreground mt-3">
              Add contacts who will receive alerts during emergencies
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SafetyCompanion;
