import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ChevronLeft, 
  Zap, 
  MapPin, 
  Clock,
  DollarSign,
  CheckCircle,
  Navigation,
  MessageSquare,
} from 'lucide-react';
import { useEV } from '@/contexts/EVContext';
import { useToast } from '@/hooks/use-toast';

const Stations = () => {
  const navigate = useNavigate();
  const { stations, batteryData, speak } = useEV();
  const [selectedStation, setSelectedStation] = useState(stations[0]);
  const { toast } = useToast();

  const calculateChargingTime = (power: string, targetSoc: number = 80) => {
    const batteryCapacity = 60; // kWh
    const powerNum = parseInt(power);
    const currentSoc = batteryData.soc;
    const energyNeeded = (batteryCapacity * (targetSoc - currentSoc)) / 100;
    const hours = energyNeeded / powerNum;
    const minutes = Math.round(hours * 60);
    
    if (minutes < 60) return `${minutes} min`;
    return `${Math.floor(minutes / 60)}h ${minutes % 60}min`;
  };

  const handleStartNavigation = () => {
    speak(`Starting navigation to ${selectedStation.name}. Distance: ${selectedStation.distance} kilometers. Turn right in 500 meters.`);
    toast({
      title: 'Navigation Started',
      description: `Guiding you to ${selectedStation.name}`,
    });
  };

  const handleSMSMode = () => {
    const message = `Nearest EV station is ${selectedStation.name} (${selectedStation.distance} km). Power: ${selectedStation.power}, Price: ₹${selectedStation.price}/kWh`;
    toast({
      title: 'SMS Sent',
      description: message,
      duration: 5000,
    });
    speak('SMS notification sent with station details.');
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
            <h1 className="text-xl font-tech font-bold">Station Details</h1>
            <p className="text-xs text-muted-foreground">Complete charging information</p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4 max-w-md mx-auto">
        {/* Station Selector */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {stations.map((station) => (
            <Button
              key={station.id}
              variant={selectedStation.id === station.id ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedStation(station)}
              className="whitespace-nowrap"
            >
              {station.name.split(' ')[0]}
            </Button>
          ))}
        </div>

        {/* Main Station Card */}
        <Card className="border-2 shadow-xl overflow-hidden">
          <div className="bg-gradient-to-br from-primary/10 to-accent/10 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h2 className="text-2xl font-tech font-bold mb-1">
                  {selectedStation.name}
                </h2>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">{selectedStation.location}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">{selectedStation.address}</p>
              </div>
              <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center">
                <Zap className="w-8 h-8 text-accent" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-6">
              <div className="bg-card/80 backdrop-blur-sm rounded-lg p-3 border border-border">
                <div className="text-xs text-muted-foreground mb-1">Distance</div>
                <div className="text-xl font-tech font-bold text-primary">
                  {selectedStation.distance} km
                </div>
              </div>
              <div className="bg-card/80 backdrop-blur-sm rounded-lg p-3 border border-border">
                <div className="text-xs text-muted-foreground mb-1">Price</div>
                <div className="text-xl font-tech font-bold text-accent">
                  ₹{selectedStation.price}/kWh
                </div>
              </div>
            </div>
          </div>

          <CardContent className="space-y-4 pt-6">
            {/* Power & Connectors */}
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Zap className="w-4 h-4 text-primary" />
                Charging Details
              </h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <span className="text-sm">Power Rating</span>
                  <Badge variant="secondary" className="font-tech">
                    {selectedStation.power}
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <span className="text-sm">Connectors</span>
                  <div className="flex gap-1">
                    {selectedStation.connectors.map((conn) => (
                      <Badge key={conn} variant="outline">
                        {conn}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <span className="text-sm">Available Slots</span>
                  <Badge 
                    variant={selectedStation.slots > 0 ? 'default' : 'destructive'}
                    className="font-tech"
                  >
                    {selectedStation.slots} {selectedStation.slots === 1 ? 'slot' : 'slots'}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Charging Time Estimates */}
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" />
                Estimated Charging Time
              </h3>
              <div className="space-y-2">
                {selectedStation.power.includes('DC') ? (
                  <>
                    <div className="flex items-center justify-between p-3 bg-gradient-to-r from-accent/10 to-accent/5 rounded-lg border border-accent/30">
                      <div>
                        <div className="font-medium text-sm">DC Fast Charge</div>
                        <div className="text-xs text-muted-foreground">
                          {Math.round(batteryData.soc)}% → 80%
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-tech font-bold text-accent">
                          {calculateChargingTime(selectedStation.power, 80)}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div>
                        <div className="font-medium text-sm">Full Charge</div>
                        <div className="text-xs text-muted-foreground">
                          {Math.round(batteryData.soc)}% → 100%
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-tech font-bold text-primary">
                          {calculateChargingTime(selectedStation.power, 100)}
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div>
                      <div className="font-medium text-sm">AC Charging</div>
                      <div className="text-xs text-muted-foreground">
                        {Math.round(batteryData.soc)}% → 100%
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-tech font-bold text-primary">
                        {calculateChargingTime(selectedStation.power, 100)}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Cost Estimate */}
            <div className="p-4 bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg border border-primary/30">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-4 h-4 text-primary" />
                <span className="font-semibold text-sm">Estimated Cost</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-tech font-bold text-primary">
                  ₹{Math.round(((80 - batteryData.soc) * 60 / 100) * selectedStation.price)}
                </span>
                <span className="text-sm text-muted-foreground">to 80%</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-2">
              <Button 
                className="w-full h-12 text-base font-semibold"
                onClick={handleStartNavigation}
              >
                <Navigation className="w-5 h-5 mr-2" />
                Start Navigation
              </Button>
              <Button 
                variant="outline"
                className="w-full h-12 text-base"
                onClick={handleSMSMode}
              >
                <MessageSquare className="w-5 h-5 mr-2" />
                Send SMS with Details
              </Button>
            </div>

            {/* Voice Assistant Tip */}
            <div className="p-3 bg-accent/10 border border-accent/30 rounded-lg">
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                <p className="text-xs text-muted-foreground">
                  This station supports fast charging. Would you like me to guide you?
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Stations;
