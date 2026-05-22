// ==========================================================
// FILE: src/pages/NavigationMap.tsx
// ==========================================================

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  ChevronLeft,
  Search,
  MapPin,
  Navigation2,
  Phone,
  Zap,
  Star,
  Clock3,
  BatteryCharging,
  Cpu,
  Wifi,
  ShieldCheck,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

import { useEV } from '@/contexts/EVContext';
import { useToast } from '@/hooks/use-toast';

// ==========================================================
// TYPES
// ==========================================================

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
  amenities: string[];
}

// ==========================================================
// COMPONENT
// ==========================================================

const NavigationMap = () => {

  const navigate = useNavigate();
  const { toast } = useToast();
  const { batteryData } = useEV();

  const [searchQuery, setSearchQuery] = useState('');

  const [selectedStation, setSelectedStation] =
    useState<MapStation | null>(null);

  const [stations, setStations] =
    useState<MapStation[]>([]);

  // ==========================================================
  // LIVE USER LOCATION
  // ==========================================================

  const [userLocation, setUserLocation] = useState({
    lat: 13.0827,
    lng: 80.2707,
  });

  useEffect(() => {

    navigator.geolocation.getCurrentPosition(

      (position) => {

        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });

      },

      (error) => {
        console.error('Location error:', error);
      }

    );

  }, []);

  // ==========================================================
  // STATIONS
  // ==========================================================

  useEffect(() => {

    setStations([

      {
        id: '1',
        name: 'Tata Power EZ Charge',
        address: 'Anna Nagar, Chennai',
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
        amenities: ['WiFi', 'Parking', 'Restroom'],
      },

      {
        id: '2',
        name: 'Zeon Fast Charging Hub',
        address: 'Tambaram, Chennai',
        distance: 2.6,
        power: '60 kW DC',
        connector: 'CCS2',
        available: 1,
        total: 4,
        rating: 4.7,
        reviews: 214,
        lat: 12.9229,
        lng: 80.1275,
        price: 24,
        openTime: '24/7',
        amenities: ['Restaurant', 'Lounge', 'WiFi'],
      },

      {
        id: '3',
        name: 'Ather Grid Station',
        address: 'T Nagar, Chennai',
        distance: 0.9,
        power: '7.4 kW AC',
        connector: 'Type-2',
        available: 3,
        total: 3,
        rating: 4.8,
        reviews: 346,
        lat: 13.0418,
        lng: 80.2341,
        price: 12,
        openTime: '24/7',
        amenities: ['Cafe', 'Parking', 'Community Hub'],
      },

    ]);

  }, []);

  // ==========================================================
  // FILTER
  // ==========================================================

  const filteredStations = stations.filter(

    (station) =>

      station.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||

      station.address
        .toLowerCase()
        .includes(searchQuery.toLowerCase())

  );

  // ==========================================================
  // NAVIGATION
  // ==========================================================

  const handleNavigate = (
    station: MapStation
  ) => {

    const origin =
      `${userLocation.lat},${userLocation.lng}`;

    const destination =
      `${station.lat},${station.lng}`;

    const googleMapsUrl =
      `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&travelmode=driving`;

    window.open(googleMapsUrl, '_blank');

    toast({
      title: 'Navigation Started',
      description: `Opening Google Maps for ${station.name}`,
    });
  };

  // ==========================================================
  // CALL
  // ==========================================================

  const handleCall = (
    station: MapStation
  ) => {

    toast({
      title: 'Connecting...',
      description: `Calling ${station.name}`,
    });

  };

  // ==========================================================
  // AVAILABILITY COLORS
  // ==========================================================

  const getAvailabilityStyle = (
    available: number,
    total: number
  ) => {

    const percentage =
      (available / total) * 100;

    if (percentage >= 70)
      return 'bg-green-500/10 text-green-600';

    if (percentage >= 40)
      return 'bg-yellow-500/10 text-yellow-600';

    return 'bg-red-500/10 text-red-600';

  };

  // ==========================================================
  // UI
  // ==========================================================

  return (

    <div className="min-h-screen bg-background">

      {/* HEADER */}

      <div className="sticky top-0 z-50 backdrop-blur-xl bg-background/80 border-b border-border">

        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-4">

          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/dashboard')}
            className="rounded-xl"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>

          <div className="flex-1">

            <h1 className="text-2xl font-bold tracking-tight">
              Smart Charging Navigation
            </h1>

            <p className="text-sm text-muted-foreground">
              AI-powered EV charging discovery & routing
            </p>

          </div>

          <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl border bg-muted/40">

            <BatteryCharging className="w-5 h-5 text-green-600" />

            <div>

              <p className="text-xs text-muted-foreground">
                Battery
              </p>

              <p className="text-sm font-semibold">
                {batteryData.soc}% • {batteryData.dte} km
              </p>

            </div>

          </div>

        </div>

      </div>

      {/* MAIN */}

      <div className="max-w-7xl mx-auto p-4 grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* SIDEBAR */}

        <div className="space-y-4">

          {/* SEARCH */}

          <Card className="rounded-3xl border shadow-sm">

            <CardContent className="p-4">

              <div className="relative">

                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />

                <Input
                  placeholder="Search charging stations..."
                  value={searchQuery}
                  onChange={(e) =>
                    setSearchQuery(e.target.value)
                  }
                  className="pl-11 h-12 rounded-2xl"
                />

              </div>

            </CardContent>

          </Card>

          {/* STATIONS */}

          <div className="space-y-4 max-h-[75vh] overflow-y-auto pr-1">

            {filteredStations.map((station) => (

              <Card
                key={station.id}
                onClick={() => setSelectedStation(station)}
                className={`cursor-pointer rounded-3xl border transition-all hover:shadow-lg hover:border-primary/40 ${
                  selectedStation?.id === station.id
                    ? 'border-primary bg-primary/5'
                    : ''
                }`}
              >

                <CardContent className="p-5">

                  <div className="flex items-start justify-between">

                    <div>

                      <h3 className="font-semibold text-lg">
                        {station.name}
                      </h3>

                      <p className="text-sm text-muted-foreground mt-1">
                        {station.address}
                      </p>

                    </div>

                    <div
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getAvailabilityStyle(
                        station.available,
                        station.total
                      )}`}
                    >
                      {station.available}/{station.total}
                    </div>

                  </div>

                  <div className="grid grid-cols-2 gap-3 mt-5">

                    <div className="rounded-2xl bg-muted/40 p-3">

                      <p className="text-xs text-muted-foreground">
                        Distance
                      </p>

                      <p className="font-semibold mt-1">
                        {station.distance} km
                      </p>

                    </div>

                    <div className="rounded-2xl bg-muted/40 p-3">

                      <p className="text-xs text-muted-foreground">
                        Price
                      </p>

                      <p className="font-semibold mt-1">
                        ₹{station.price}/kWh
                      </p>

                    </div>

                  </div>

                  <div className="flex items-center justify-between mt-4">

                    <div className="flex items-center gap-2 text-sm">

                      <Zap className="w-4 h-4 text-yellow-500" />

                      <span>{station.power}</span>

                    </div>

                    <div className="flex items-center gap-1 text-sm">

                      <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />

                      {station.rating}

                    </div>

                  </div>

                </CardContent>

              </Card>

            ))}

          </div>

        </div>

        {/* RIGHT PANEL */}

        <div className="lg:col-span-2 space-y-6">

          {selectedStation ? (

            <>

              {/* GOOGLE MAP */}

              <Card className="rounded-3xl overflow-hidden border shadow-sm">

                <CardContent className="p-0">

                  <iframe
                    title="Google Maps"
                    width="100%"
                    height="400"
                    loading="lazy"
                    allowFullScreen
                    className="border-0"
                    referrerPolicy="no-referrer-when-downgrade"
                    src={`https://www.google.com/maps?q=${selectedStation.lat},${selectedStation.lng}&z=15&output=embed`}
                  />

                </CardContent>

              </Card>

              {/* DETAILS */}

              <Card className="rounded-3xl border shadow-sm">

                <CardContent className="p-6 space-y-6">

                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                    <div>

                      <h2 className="text-2xl font-bold">
                        {selectedStation.name}
                      </h2>

                      <p className="text-muted-foreground mt-1">
                        {selectedStation.address}
                      </p>

                    </div>

                    <div className="flex items-center gap-2">

                      <div className="px-4 py-2 rounded-2xl bg-primary/10 text-primary font-medium">
                        {selectedStation.connector}
                      </div>

                      <div className="px-4 py-2 rounded-2xl bg-green-500/10 text-green-600 font-medium">
                        Open {selectedStation.openTime}
                      </div>

                    </div>

                  </div>

                  {/* STATS */}

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

                    <div className="rounded-2xl border p-4">

                      <Clock3 className="w-5 h-5 text-primary mb-3" />

                      <p className="text-xs text-muted-foreground">
                        ETA
                      </p>

                      <p className="font-bold text-lg">
                        {Math.ceil(selectedStation.distance * 3)} min
                      </p>

                    </div>

                    <div className="rounded-2xl border p-4">

                      <Zap className="w-5 h-5 text-yellow-500 mb-3" />

                      <p className="text-xs text-muted-foreground">
                        Charging
                      </p>

                      <p className="font-bold text-lg">
                        {selectedStation.power}
                      </p>

                    </div>

                    <div className="rounded-2xl border p-4">

                      <Star className="w-5 h-5 text-yellow-500 mb-3" />

                      <p className="text-xs text-muted-foreground">
                        Rating
                      </p>

                      <p className="font-bold text-lg">
                        {selectedStation.rating}
                      </p>

                    </div>

                    <div className="rounded-2xl border p-4">

                      <Cpu className="w-5 h-5 text-cyan-500 mb-3" />

                      <p className="text-xs text-muted-foreground">
                        Price
                      </p>

                      <p className="font-bold text-lg">
                        ₹{selectedStation.price}
                      </p>

                    </div>

                  </div>

                  {/* AMENITIES */}

                  <div>

                    <h3 className="font-semibold text-lg mb-4">
                      Amenities
                    </h3>

                    <div className="flex flex-wrap gap-3">

                      {selectedStation.amenities.map(
                        (amenity, index) => (

                          <div
                            key={index}
                            className="px-4 py-2 rounded-2xl bg-muted/40 border text-sm flex items-center gap-2"
                          >

                            <Wifi className="w-4 h-4 text-primary" />

                            {amenity}

                          </div>

                        )
                      )}

                    </div>

                  </div>

                  {/* ACTION BUTTONS */}

                  <div className="grid md:grid-cols-3 gap-4 pt-4 border-t">

                    <Button
                      onClick={() =>
                        handleNavigate(selectedStation)
                      }
                      className="h-12 rounded-2xl text-base"
                    >

                      <Navigation2 className="w-5 h-5 mr-2" />

                      Start Navigation

                    </Button>

                    <Button
                      variant="outline"
                      onClick={() =>
                        handleCall(selectedStation)
                      }
                      className="h-12 rounded-2xl text-base"
                    >

                      <Phone className="w-5 h-5 mr-2" />

                      Contact Station

                    </Button>

                    <Button
                      variant="secondary"
                      onClick={() => {

                        window.open(
                          `https://www.google.com/maps/search/?api=1&query=${selectedStation.lat},${selectedStation.lng}`,
                          '_blank'
                        );

                      }}
                      className="h-12 rounded-2xl text-base"
                    >

                      <MapPin className="w-5 h-5 mr-2" />

                      Open in Maps

                    </Button>

                  </div>

                  {/* AI MESSAGE */}

                  <div className="rounded-2xl border bg-green-500/5 p-4 flex items-start gap-3">

                    <ShieldCheck className="w-5 h-5 text-green-600 mt-1" />

                    <div>

                      <h4 className="font-semibold text-green-700 dark:text-green-400">
                        AI Recommendation
                      </h4>

                      <p className="text-sm text-muted-foreground mt-1">
                        This charging station is the safest and most efficient
                        nearby option based on your battery range and distance.
                      </p>

                    </div>

                  </div>

                </CardContent>

              </Card>

            </>

          ) : (

            <Card className="rounded-3xl border border-dashed h-[700px] flex items-center justify-center">

              <CardContent className="text-center">

                <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">

                  <MapPin className="w-10 h-10 text-muted-foreground" />

                </div>

                <h2 className="text-2xl font-bold">
                  Select a Charging Station
                </h2>

                <p className="text-muted-foreground mt-2">
                  View live station details, smart navigation,
                  charging availability and AI suggestions.
                </p>

              </CardContent>

            </Card>

          )}

        </div>

      </div>

    </div>

  );

};

export default NavigationMap;
