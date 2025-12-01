import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { 
  MapPin, 
  Navigation, 
  Search, 
  Mic, 
  ChevronLeft,
  Zap,
  Battery,
  AlertTriangle,
} from 'lucide-react';
import { useEV } from '@/contexts/EVContext';
import { VoiceAssistant } from '@/components/VoiceAssistant';
import { useToast } from '@/hooks/use-toast';

const Map = () => {
  const navigate = useNavigate();
  const { stations, batteryData, speak, searchRadius } = useEV();
  const [searchQuery, setSearchQuery] = useState('');
  const [voiceMessage, setVoiceMessage] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [selectedStation, setSelectedStation] = useState<string | null>(null);
  const [showRouteWarning, setShowRouteWarning] = useState(false);
  const [routeWarning, setRouteWarning] = useState('');
  const { toast } = useToast();

  const filteredStations = stations.filter(s => 
    s.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.name.toLowerCase().includes(searchQuery.toLowerCase())
  ).filter(s => s.distance <= searchRadius);

  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    
    const nearest = filteredStations[0];
    if (nearest) {
      setVoiceMessage(
        `Nearest EV station to ${searchQuery} is ${nearest.name}, ${nearest.distance} kilometers away. It has ${nearest.slots} available slots and charges ${nearest.price} rupees per kilowatt hour.`
      );
      speak(`Nearest EV station to ${searchQuery} is ${nearest.name}, ${nearest.distance} kilometers away.`);
    } else {
      setVoiceMessage(`No charging stations found near ${searchQuery} within your search radius.`);
      speak(`No charging stations found near ${searchQuery}.`);
    }
  };

  const handleVoiceInput = () => {
    setIsListening(true);
    // Simulate voice input
    setTimeout(() => {
      const mockLocations = ['Anna Nagar', 'T Nagar', 'Tambaram', 'Velachery'];
      const randomLocation = mockLocations[Math.floor(Math.random() * mockLocations.length)];
      setSearchQuery(randomLocation);
      setIsListening(false);
      toast({
        title: 'Voice recognized',
        description: `Searching for stations near ${randomLocation}`,
      });
      setTimeout(() => handleSearch(), 500);
    }, 2000);
  };

  const handleNavigate = (stationId: string) => {
    const station = stations.find(s => s.id === stationId);
    if (station) {
      // Check for safe route warnings
      const isSafeRoute = Math.random() > 0.3; // 70% routes are safe
      
      if (!isSafeRoute) {
        const warningMsg = `Warning: This route includes roads with limited EV charging infrastructure. Alternative route recommended for safety.`;
        setRouteWarning(warningMsg);
        setShowRouteWarning(true);
        speak(warningMsg);
        setTimeout(() => setShowRouteWarning(false), 5000);
      }
      
      const estimatedTime = Math.round(station.distance * 3);
      const message = `Starting navigation to ${station.name}. Distance: ${station.distance} kilometers. Estimated arrival time: ${estimatedTime} minutes. ${!isSafeRoute ? 'Please exercise caution on this route.' : 'Route is EV safe with multiple charging options available.'}`;
      
      setVoiceMessage(message);
      speak(message);
      
      toast({
        title: 'Navigation Started',
        description: `Guiding you to ${station.name}`,
      });
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Route Warning */}
      {showRouteWarning && (
        <div className="fixed top-24 left-1/2 transform -translate-x-1/2 z-50 max-w-sm w-full px-4">
          <Card className="border-2 border-warning bg-warning/10 backdrop-blur-lg">
            <CardContent className="p-4 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
              <p className="text-sm text-foreground">{routeWarning}</p>
            </CardContent>
          </Card>
        </div>
      )}

      <VoiceAssistant message={voiceMessage} autoHide={true} />
      
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
            <h1 className="text-xl font-tech font-bold">Charging Stations</h1>
            <p className="text-xs text-muted-foreground">Find nearby EV chargers</p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 rounded-full border border-primary/30">
            <Battery className="w-4 h-4 text-primary" />
            <span className="text-sm font-tech font-bold">{Math.round(batteryData.soc)}%</span>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4 max-w-md mx-auto">
        {/* Search Bar */}
        <Card className="p-3">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Search location..."
                className="pl-9"
              />
            </div>
            <Button
              size="icon"
              onClick={handleVoiceInput}
              disabled={isListening}
              className={isListening ? 'animate-pulse' : ''}
            >
              <Mic className="w-4 h-4" />
            </Button>
            <Button onClick={handleSearch}>
              Search
            </Button>
          </div>
        </Card>

        {/* Map Visualization */}
        <Card className="relative h-64 overflow-hidden border-2">
          <div className="absolute inset-0 bg-gradient-to-br from-muted via-muted to-muted/80">
            {/* Grid overlay for map effect */}
            <div className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: `
                  linear-gradient(hsl(var(--border)) 1px, transparent 1px),
                  linear-gradient(90deg, hsl(var(--border)) 1px, transparent 1px)
                `,
                backgroundSize: '20px 20px'
              }}
            />
            
            {/* Station markers */}
            {filteredStations.map((station, index) => (
              <div
                key={station.id}
                className={`absolute cursor-pointer transition-transform hover:scale-125 ${
                  selectedStation === station.id ? 'scale-125 z-10' : ''
                }`}
                style={{
                  left: `${20 + (index * 18)}%`,
                  top: `${30 + (index * 12)}%`,
                }}
                onClick={() => setSelectedStation(station.id)}
              >
                <div className="relative">
                  <div className="absolute -inset-2 bg-accent/20 rounded-full animate-ping" />
                  <div className="relative w-8 h-8 bg-accent rounded-full flex items-center justify-center border-2 border-background shadow-lg">
                    <Zap className="w-4 h-4 text-accent-foreground" />
                  </div>
                  {selectedStation === station.id && (
                    <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 bg-card border border-border rounded-lg p-2 shadow-xl whitespace-nowrap text-xs">
                      <div className="font-semibold">{station.name}</div>
                      <div className="text-muted-foreground">{station.distance} km</div>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Vehicle position */}
            <div className="absolute bottom-8 left-8">
              <div className="relative">
                <div className="absolute -inset-3 bg-primary/20 rounded-full animate-pulse" />
                <div className="relative w-10 h-10 bg-primary rounded-full flex items-center justify-center border-4 border-background shadow-xl">
                  <Navigation className="w-5 h-5 text-primary-foreground" />
                </div>
              </div>
            </div>
          </div>

          {/* Map legend */}
          <div className="absolute bottom-4 right-4 bg-card/90 backdrop-blur-sm rounded-lg p-2 border border-border text-xs space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-primary rounded-full" />
              <span>Your Location</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-accent rounded-full" />
              <span>EV Station</span>
            </div>
          </div>
        </Card>

        {/* Station List */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-tech font-bold">
              Nearby Stations ({filteredStations.length})
            </h2>
            <span className="text-xs text-muted-foreground">
              Within {searchRadius} km
            </span>
          </div>
          
          {filteredStations.length === 0 ? (
            <Card className="p-8 text-center">
              <MapPin className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
              <p className="text-muted-foreground">No stations found in your area</p>
              <p className="text-xs text-muted-foreground mt-1">Try increasing search radius in settings</p>
            </Card>
          ) : (
            filteredStations.map((station) => (
              <Card
                key={station.id}
                className={`p-4 cursor-pointer transition-all hover:shadow-lg ${
                  selectedStation === station.id ? 'border-2 border-primary' : ''
                }`}
                onClick={() => setSelectedStation(station.id)}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Zap className="w-4 h-4 text-accent" />
                      <h3 className="font-semibold">{station.name}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{station.location}</p>
                    
                    <div className="flex flex-wrap gap-2 text-xs">
                      <span className="px-2 py-1 bg-muted rounded-full">
                        {station.power}
                      </span>
                      <span className="px-2 py-1 bg-muted rounded-full">
                        {station.connectors.join(', ')}
                      </span>
                      <span className="px-2 py-1 bg-success/20 text-success rounded-full font-semibold">
                        {station.slots} slots
                      </span>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-lg font-tech font-bold text-primary">
                      {station.distance} km
                    </div>
                    <div className="text-xs text-muted-foreground">
                      ₹{station.price}/kWh
                    </div>
                  </div>
                </div>
                
                <Button
                  className="w-full mt-3"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNavigate(station.id);
                  }}
                >
                  <Navigation className="w-4 h-4 mr-2" />
                  Start Navigation
                </Button>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Map;
