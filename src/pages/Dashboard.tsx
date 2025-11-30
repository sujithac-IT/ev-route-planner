import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Battery, 
  Thermometer, 
  MapPin, 
  Zap, 
  History,
  Gauge,
  TrendingUp,
  Clock,
  AlertTriangle,
  Leaf,
} from 'lucide-react';
import { useEV } from '@/contexts/EVContext';
import { VoiceAssistant } from '@/components/VoiceAssistant';
import { VoiceToggle } from '@/components/VoiceAssistant';

const Dashboard = () => {
  const navigate = useNavigate();
  const { batteryData, speak } = useEV();
  const [tip, setTip] = useState('');
  const [ecoRange, setEcoRange] = useState(0);
  const [normalRange, setNormalRange] = useState(0);
  const [sportRange, setSportRange] = useState(0);

  useEffect(() => {
    const tips = [
      'Tip: Fast charging 3 times a week reduces battery life by 2% annually.',
      'Tip: Maintain battery between 20-80% for optimal health.',
      'Tip: Precondition your battery before DC fast charging for better results.',
      'Tip: Regenerative braking can extend your range by up to 20%.',
    ];
    setTip(tips[Math.floor(Math.random() * tips.length)]);
    
    // Calculate range estimates
    setEcoRange(Math.round(batteryData.dte * 1.2));
    setNormalRange(batteryData.dte);
    setSportRange(Math.round(batteryData.dte * 0.75));
  }, [batteryData.dte]);

  const getBatteryColor = () => {
    if (batteryData.soc > 60) return 'text-battery-full';
    if (batteryData.soc > 20) return 'text-battery-mid';
    return 'text-battery-low';
  };

  const getStatusColor = () => {
    if (batteryData.status === 'Normal') return 'bg-success/20 text-success border-success/30';
    if (batteryData.status === 'Low Battery') return 'bg-warning/20 text-warning border-warning/30';
    return 'bg-destructive/20 text-destructive border-destructive/30';
  };

  const calculateChargingTime = (power: number, targetSoc: number = 80) => {
    const batteryCapacity = 60; // kWh (example)
    const currentSoc = batteryData.soc;
    const energyNeeded = (batteryCapacity * (targetSoc - currentSoc)) / 100;
    const hours = energyNeeded / power;
    const minutes = Math.round(hours * 60);
    
    if (minutes < 60) return `${minutes} min`;
    return `${Math.floor(minutes / 60)}h ${minutes % 60}min`;
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <VoiceAssistant message={tip} autoHide={false} />
      
      {/* Header */}
      <div className="sticky top-0 z-40 bg-card/95 backdrop-blur-lg border-b border-border">
        <div className="flex items-center justify-between p-4">
          <div>
            <h1 className="text-2xl font-tech font-bold">Dashboard</h1>
            <p className="text-sm text-muted-foreground">Real-time vehicle monitoring</p>
          </div>
          <VoiceToggle />
        </div>
      </div>

      <div className="p-4 space-y-6 max-w-md mx-auto">
        {/* Main Battery Card */}
        <Card className="border-2 shadow-xl overflow-hidden">
          <div className="bg-gradient-to-br from-primary/10 to-accent/10 p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Battery className={`w-8 h-8 ${getBatteryColor()}`} />
                <span className="font-tech text-lg">Battery Status</span>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor()}`}>
                {batteryData.status}
              </span>
            </div>

            {/* Circular Battery Indicator */}
            <div className="relative w-48 h-48 mx-auto">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="8"
                  className="text-muted opacity-20"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="8"
                  strokeLinecap="round"
                  className={getBatteryColor()}
                  strokeDasharray={`${(batteryData.soc / 100) * 283} 283`}
                  style={{ 
                    filter: batteryData.soc > 60 ? 'drop-shadow(0 0 8px hsl(var(--battery-full)))' : 'none',
                    transition: 'all 0.5s ease'
                  }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className={`text-5xl font-tech font-bold ${getBatteryColor()}`}>
                  {Math.round(batteryData.soc)}%
                </div>
                <div className="text-sm text-muted-foreground mt-1">State of Charge</div>
              </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-3 gap-4 mt-6">
              <div className="text-center">
                <div className="text-2xl font-bold font-tech">{batteryData.soh}%</div>
                <div className="text-xs text-muted-foreground">SOH</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold font-tech flex items-center justify-center gap-1">
                  {batteryData.temperature}°C
                </div>
                <div className="text-xs text-muted-foreground">Temp</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold font-tech">{batteryData.dte}</div>
                <div className="text-xs text-muted-foreground">DTE (km)</div>
              </div>
            </div>

            <div className="mt-4 text-center">
              <p className="text-xs text-muted-foreground">Last Sync: Just now</p>
            </div>
          </div>
        </Card>

        {/* Range Predictions */}
        <Card className="border-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Gauge className="w-5 h-5 text-primary" />
              Predicted Range
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-lg bg-success/10 border border-success/30">
              <div className="flex items-center gap-2">
                <Leaf className="w-4 h-4 text-success" />
                <span className="text-sm font-medium">Eco Mode</span>
              </div>
              <span className="font-tech font-bold text-success">{ecoRange} km</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-primary/10 border border-primary/30">
              <div className="flex items-center gap-2">
                <Gauge className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">Normal Mode</span>
              </div>
              <span className="font-tech font-bold text-primary">{normalRange} km</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-warning/10 border border-warning/30">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-warning" />
                <span className="text-sm font-medium">Sport Mode</span>
              </div>
              <span className="font-tech font-bold text-warning">{sportRange} km</span>
            </div>
          </CardContent>
        </Card>

        {/* Charging Time Estimates */}
        <Card className="border-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="w-5 h-5 text-accent" />
              Charging Time Estimates
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted">
              <div>
                <div className="font-medium text-sm">AC 7.4 kW</div>
                <div className="text-xs text-muted-foreground">Home charging</div>
              </div>
              <div className="text-right">
                <div className="font-tech font-bold text-primary">{calculateChargingTime(7.4)}</div>
                <div className="text-xs text-muted-foreground">to 80%</div>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted">
              <div>
                <div className="font-medium text-sm">DC 50 kW</div>
                <div className="text-xs text-muted-foreground">Fast charging</div>
              </div>
              <div className="text-right">
                <div className="font-tech font-bold text-accent">{calculateChargingTime(50)}</div>
                <div className="text-xs text-muted-foreground">to 80%</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-3 gap-3">
          <Button
            onClick={() => navigate('/map')}
            className="h-24 flex flex-col items-center justify-center gap-2"
            variant="outline"
          >
            <MapPin className="w-6 h-6" />
            <span className="text-xs">GPS Map</span>
          </Button>
          <Button
            onClick={() => navigate('/stations')}
            className="h-24 flex flex-col items-center justify-center gap-2"
            variant="outline"
          >
            <Zap className="w-6 h-6" />
            <span className="text-xs">Stations</span>
          </Button>
          <Button
            onClick={() => navigate('/history')}
            className="h-24 flex flex-col items-center justify-center gap-2"
            variant="outline"
          >
            <History className="w-6 h-6" />
            <span className="text-xs">History</span>
          </Button>
        </div>

        {/* Warning for Low Battery */}
        {batteryData.soc < 20 && (
          <Card className="border-2 border-warning bg-warning/10">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-warning">Low Battery Warning</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Your battery is running low. Consider charging soon or head to the nearest station.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border">
        <div className="flex justify-around p-2 max-w-md mx-auto">
          <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard')} className="flex flex-col gap-1">
            <Gauge className="w-5 h-5" />
            <span className="text-xs">Home</span>
          </Button>
          <Button variant="ghost" size="sm" onClick={() => navigate('/notifications')} className="flex flex-col gap-1">
            <AlertTriangle className="w-5 h-5" />
            <span className="text-xs">Alerts</span>
          </Button>
          <Button variant="ghost" size="sm" onClick={() => navigate('/history')} className="flex flex-col gap-1">
            <History className="w-5 h-5" />
            <span className="text-xs">History</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
