import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  ChevronLeft,
  MapPin,
  Navigation,
  Search,
  Phone,
  Clock,
  AlertCircle,
  Zap,
  Users,
  Star,
  Fuel,
  Navigation2,
} from 'lucide-react';
import { useEV } from '@/contexts/EVContext';
import { useToast } from '@/hooks/use-toast';

interface MapStation {
  id: string;
  name: string;
  address: string;
  distance: number;
  power: string;
  connector: string;
  available: number;
  total: number;
  rating: number;
  reviews: number;
  lat: number;
  lng: number;
  price: number;
  openTime: string;
  closeTime: string;
  amenities: string[];
}

const NavigationMap = () => {
  const navigate = useNavigate();
  const { stations, batteryData } = useEV();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStation, setSelectedStation] = useState<MapStation | null>(null);
  const [mapStations, setMapStations] = useState<MapStation[]>([]);
  const [userLocation, setUserLocation] = useState({ lat: 13.0827, lng: 80.2707 }); // Chennai default

  // Initialize map stations with mock data
  useEffect(() => {
    const mockStations: MapStation[] = [
      {
        id: '1',
        name: 'Tata Power EZ Charge - Anna Nagar',
        address: '123 Anna Nagar Main Rd, Chennai 600040',
        distance: 1.4,
        power: '30 kW DC',
        connector: 'CCS2',
        available: 2,
        total: 3,
        rating: 4.5,
        reviews: 128,
        lat: 13.0869,
        lng: 80.2093,
        price: 18,
        openTime: '24/7',
        closeTime: '24/7',
        amenities: ['WiFi', 'Restroom', 'Café', 'Parking'],
      },
      {
        id: '2',
        name: 'Zeon Charging Station - Tambaram',
        address: '456 GST Rd, Tambaram, Chennai 600045',
        distance: 2.1,
        power: '50 kW DC',
        connector: 'CCS2, Type-2',
        available: 1,
        total: 4,
        rating: 4.3,
        reviews: 95,
        lat: 12.9229,
        lng: 80.1275,
        price: 22,
        openTime: '06:00 AM',
        closeTime: '10:00 PM',
        amenities: ['WiFi', 'Restaurant', 'Shopping', 'EV Car Wash'],
      },
      {
        id: '3',
        name: 'Ather Grid - T Nagar',
        address: 'Pondy Bazaar, T Nagar, Chennai 600017',
        distance: 0.8,
        power: '7.4 kW AC',
        connector: 'Type-2',
        available: 3,
        total: 3,
        rating: 4.7,
        reviews: 234,
        lat: 13.0418,
        lng: 80.2341,
        price: 12,
        openTime: '24/7',
        closeTime: '24/7',
        amenities: ['WiFi', 'Community Space', 'EV Merchandise', 'Parking'],
      },
      {
        id: '4',
        name: 'Exicom Charging Hub - Velachery',
        address: 'Velachery Main Rd, Chennai 600042',
        distance: 3.5,
        power: '60 kW DC',
        connector: 'CCS2, CHAdeMO',
        available: 2,
        total: 6,
        rating: 4.4,
        reviews: 167,
        lat: 12.9750,
        lng: 80.2207,
        price: 25,
        openTime: '24/7',
        closeTime: '24/7',
        amenities: ['WiFi', 'Lounge', 'Meal', 'Shopping'],
      },
      {
        id: '5',
        name: 'ChargeZone Station - OMR',
        address: 'Old Mahabalipuram Rd, Chennai 600096',
        distance: 5.2,
        power: '120 kW DC',
        connector: 'CCS2',
        available: 1,
        total: 2,
        rating: 4.6,
        reviews: 145,
        lat: 12.9142,
        lng: 80.2273,
        price: 30,
        openTime: '24/7',
        closeTime: '24/7',
        amenities: ['WiFi', 'Premium Lounge', 'Restaurant', 'Shopping'],
      },
    ];
    setMapStations(mockStations);
  }, []);

  const filteredStations = mapStations.filter(
    (station) =>
      station.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      station.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectStation = (station: MapStation) => {
    setSelectedStation(station);
    toast({
      title: 'Station Selected',
      description: `${station.name} selected for navigation`,
    });
  };

  const handleNavigate = (station: MapStation) => {
    toast({
      title: 'Navigation Started',
      description: `Navigating to ${station.name}. ETA: ${Math.ceil(station.distance * 3)} minutes`,
    });
    // In production, integrate with actual maps API
  };

  const handleCall = (stationName: string) => {
    toast({
      title: 'Calling Station',
      description: `Calling ${stationName}...`,
    });
  };

  const getDistanceColor = (distance: number) => {
    if (distance < 1) return 'text-green-600';
    if (distance < 3) return 'text-yellow-600';
    return 'text-orange-600';
  };

  const getAvailabilityColor = (available: number, total: number) => {
    const percentage = (available / total) * 100;
    if (percentage >= 66) return 'bg-green-100 text-green-800';
    if (percentage >= 33) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <div className="min-h-screen bg-background pb-6">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-card/95 backdrop-blur-lg border-b border-border">
        <div className="flex items-center gap-3 p-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')}>
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-xl font-tech font-bold">Charging Map</h1>
            <p className="text-xs text-muted-foreground">Find & navigate to stations near you</p>
          </div>
        </div>
      </div>

      <div className="p-4 max-w-6xl mx-auto">
        {/* Current Battery Status */}
        <Card className="border-2 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950 mb-4">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Current Battery</p>
                <p className="text-2xl font-tech font-bold text-primary">{batteryData.soc}%</p>
                <p className="text-xs text-muted-foreground">DTE: {batteryData.dte} km</p>
              </div>
              <div className="text-4xl">🔋</div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Left Sidebar - Station List */}
          <div className="lg:col-span-1 space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search stations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Station List */}
            <div className="space-y-2 max-h-[600px] overflow-y-auto">
              {filteredStations.length > 0 ? (
                filteredStations.map((station) => (
                  <Card
                    key={station.id}
                    className={`border-2 cursor-pointer transition-all ${
                      selectedStation?.id === station.id
                        ? 'border-primary bg-primary/5'
                        : 'hover:border-primary/50'
                    }`}
                    onClick={() => handleSelectStation(station)}
                  >
                    <CardContent className="pt-4">
                      <div className="space-y-2">
                        <div>
                          <h4 className="font-semibold text-sm text-card-foreground line-clamp-1">
                            {station.name}
                          </h4>
                          <p className="text-xs text-muted-foreground line-clamp-1">{station.address}</p>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className={`text-sm font-bold ${getDistanceColor(station.distance)}`}>
                            📍 {station.distance} km
                          </span>
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                            <span className="text-xs font-medium">{station.rating}</span>
                            <span className="text-xs text-muted-foreground">({station.reviews})</span>
                          </div>
                        </div>

                        <div className={`text-xs px-2 py-1 rounded text-center font-medium ${getAvailabilityColor(
                          station.available,
                          station.total
                        )}`}>
                          {station.available}/{station.total} Available
                        </div>

                        <div className="flex items-center justify-between text-xs">
                          <span className="flex items-center gap-1">
                            <Zap className="w-3 h-3" />
                            {station.power}
                          </span>
                          <span className="font-medium">₹{station.price}/kWh</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card className="border-2 border-dashed">
                  <CardContent className="pt-6 text-center">
                    <p className="text-sm text-muted-foreground">No stations found</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Right Side - Station Details & Map */}
          <div className="lg:col-span-2 space-y-4">
            {selectedStation ? (
              <>
                {/* Map View (Mock) */}
                <Card className="border-2 overflow-hidden">
                  <CardContent className="p-0 h-64 bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-800 dark:to-slate-900 relative flex items-center justify-center">
                    <div className="text-center">
                      <MapPin className="w-12 h-12 mx-auto text-primary mb-2 opacity-50" />
                      <p className="text-sm text-muted-foreground">
                        📍 {selectedStation.name}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Coordinates: {selectedStation.lat.toFixed(4)}, {selectedStation.lng.toFixed(4)}
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">
                        (In production: Integrated with Google Maps API)
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Station Details */}
                <Card className="border-2">
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-primary" />
                      {selectedStation.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Address & Distance */}
                    <div className="space-y-2">
                      <p className="text-sm">
                        <span className="text-muted-foreground">Address:</span> {selectedStation.address}
                      </p>
                      <p className="text-sm">
                        <span className="text-muted-foreground">Distance:</span>{' '}
                        <span className="font-medium">{selectedStation.distance} km away</span>
                      </p>
                    </div>

                    {/* Hours & Contact */}
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="w-4 h-4 text-primary" />
                        <div>
                          <p className="text-muted-foreground text-xs">Hours</p>
                          <p className="font-medium">{selectedStation.openTime}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="w-4 h-4 text-primary" />
                        <div>
                          <p className="text-muted-foreground text-xs">Phone</p>
                          <p className="font-medium">+91 XXXX XXXX</p>
                        </div>
                      </div>
                    </div>

                    {/* Charging Details */}
                    <div className="border-t border-border pt-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Power Output</span>
                        <span className="font-medium">{selectedStation.power}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Connector Type</span>
                        <span className="font-medium">{selectedStation.connector}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Price</span>
                        <span className="font-medium">₹{selectedStation.price}/kWh</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Availability</span>
                        <span className={`px-2 py-1 rounded text-sm font-medium ${getAvailabilityColor(
                          selectedStation.available,
                          selectedStation.total
                        )}`}>
                          {selectedStation.available}/{selectedStation.total}
                        </span>
                      </div>
                    </div>

                    {/* Amenities */}
                    <div className="border-t border-border pt-3">
                      <p className="text-sm font-medium mb-2">Amenities</p>
                      <div className="flex flex-wrap gap-2">
                        {selectedStation.amenities.map((amenity, idx) => (
                          <span
                            key={idx}
                            className="text-xs bg-primary/10 px-2 py-1 rounded flex items-center gap-1"
                          >
                            ✓ {amenity}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Rating & Reviews */}
                    <div className="border-t border-border pt-3">
                      <div className="flex items-center gap-3">
                        <div>
                          <p className="text-xs text-muted-foreground">Community Rating</p>
                          <div className="flex items-center gap-1">
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < Math.floor(selectedStation.rating)
                                      ? 'text-yellow-500 fill-yellow-500'
                                      : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-sm font-medium">{selectedStation.rating}</span>
                            <span className="text-xs text-muted-foreground">
                              ({selectedStation.reviews} reviews)
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-2 gap-2 border-t border-border pt-3">
                      <Button
                        onClick={() => handleNavigate(selectedStation)}
                        className="flex items-center gap-2"
                      >
                        <Navigation2 className="w-4 h-4" />
                        Navigate
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => handleCall(selectedStation.name)}
                        className="flex items-center gap-2"
                      >
                        <Phone className="w-4 h-4" />
                        Call
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card className="border-2 border-dashed h-96 flex items-center justify-center">
                <CardContent className="text-center">
                  <AlertCircle className="w-12 h-12 mx-auto text-muted-foreground opacity-50 mb-2" />
                  <p className="text-sm text-muted-foreground">Select a station to view details</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavigationMap;
