import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { 
  ChevronLeft, 
  User,
  Bell,
  MapPin,
  Volume2,
  Moon,
  Sun,
  Car,
  LogOut,
  Shield,
} from 'lucide-react';
import { useEV } from '@/contexts/EVContext';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

const Settings = () => {
  const navigate = useNavigate();
  const { 
    user, 
    setUser, 
    isDarkMode, 
    toggleDarkMode,
    voiceAssistantActive,
    setVoiceAssistantActive,
    batteryData,
    searchRadius,
    setSearchRadius,
  } = useEV();
  
  const [lowSocThreshold, setLowSocThreshold] = useState(20);
  const [gpsTracking, setGpsTracking] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(true);
  const { toast } = useToast();

  const handleLogout = () => {
    setUser(null);
    toast({
      title: 'Logged Out',
      description: 'You have been successfully logged out',
    });
    navigate('/');
  };

  const handleSmsToggle = (enabled: boolean) => {
    setSmsNotifications(enabled);
    toast({
      title: enabled ? 'SMS Enabled' : 'SMS Disabled',
      description: enabled 
        ? 'You will receive SMS notifications for important alerts' 
        : 'SMS notifications have been turned off',
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
            <h1 className="text-xl font-tech font-bold">Settings</h1>
            <p className="text-xs text-muted-foreground">Customize your EV Sense experience</p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4 max-w-md mx-auto">
        {/* User Profile */}
        <Card className="border-2">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <User className="w-5 h-5 text-primary" />
              User Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <span className="text-sm text-muted-foreground">Email</span>
              <span className="font-medium text-sm">{user?.email || 'Not set'}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <span className="text-sm text-muted-foreground">Vehicle ID</span>
              <span className="font-tech font-bold text-sm">{user?.vehicleId || 'Not set'}</span>
            </div>
          </CardContent>
        </Card>

        {/* Appearance */}
        <Card className="border-2">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              {isDarkMode ? <Moon className="w-5 h-5 text-primary" /> : <Sun className="w-5 h-5 text-warning" />}
              Appearance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {isDarkMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                <div>
                  <Label className="text-sm font-medium">Theme</Label>
                  <p className="text-xs text-muted-foreground">
                    {isDarkMode ? 'Dark Mode' : 'Light Mode'}
                  </p>
                </div>
              </div>
              <Switch
                checked={isDarkMode}
                onCheckedChange={toggleDarkMode}
              />
            </div>
          </CardContent>
        </Card>

        {/* Battery Alerts */}
        <Card className="border-2">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Bell className="w-5 h-5 text-warning" />
              Battery Alerts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label className="text-sm font-medium">Low SOC Threshold</Label>
                <span className="text-sm font-tech font-bold text-warning">
                  {lowSocThreshold}%
                </span>
              </div>
              <Slider
                value={[lowSocThreshold]}
                onValueChange={(value) => setLowSocThreshold(value[0])}
                min={10}
                max={40}
                step={5}
                className="mt-2"
              />
              <p className="text-xs text-muted-foreground mt-2">
                Get notified when battery drops below this level
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Location & GPS */}
        <Card className="border-2">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <MapPin className="w-5 h-5 text-accent" />
              Location & GPS
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">GPS Tracking</Label>
                <p className="text-xs text-muted-foreground">Track your vehicle location</p>
              </div>
              <Switch
                checked={gpsTracking}
                onCheckedChange={setGpsTracking}
              />
            </div>

            <div className="pt-3 border-t border-border">
              <div className="flex items-center justify-between mb-2">
                <Label className="text-sm font-medium">EV Station Radius</Label>
                <span className="text-sm font-tech font-bold text-primary">
                  {searchRadius} km
                </span>
              </div>
              <Slider
                value={[searchRadius]}
                onValueChange={(value) => setSearchRadius(value[0])}
                min={1}
                max={10}
                step={1}
                className="mt-2"
              />
              <p className="text-xs text-muted-foreground mt-2">
                Search for charging stations within this radius
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card className="border-2">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Bell className="w-5 h-5 text-primary" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div>
                <Label className="text-sm font-medium">SMS Notifications</Label>
                <p className="text-xs text-muted-foreground">Receive alerts via SMS</p>
              </div>
              <Switch
                checked={smsNotifications}
                onCheckedChange={handleSmsToggle}
              />
            </div>
          </CardContent>
        </Card>

        {/* Voice Assistant */}
        <Card className="border-2">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Volume2 className="w-5 h-5 text-accent" />
              Voice Assistant
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">AI Voice Assistant</Label>
                <p className="text-xs text-muted-foreground">
                  Enable voice guidance and alerts
                </p>
              </div>
              <Switch
                checked={voiceAssistantActive}
                onCheckedChange={setVoiceAssistantActive}
              />
            </div>
          </CardContent>
        </Card>

        {/* Vehicle Info */}
        <Card className="border-2 bg-gradient-to-br from-primary/10 to-primary/5">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Car className="w-5 h-5 text-primary" />
              Linked Vehicle
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Battery Capacity</span>
              <span className="font-tech font-bold">60 kWh</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Current SOH</span>
              <span className="font-tech font-bold text-success">{batteryData.soh}%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Connector Type</span>
              <span className="font-medium">CCS2</span>
            </div>
          </CardContent>
        </Card>

        {/* Security & Privacy */}
        <Card className="border-2">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              Security & Privacy
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="outline" className="w-full justify-start">
              <Shield className="w-4 h-4 mr-2" />
              Change Password
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Shield className="w-4 h-4 mr-2" />
              Privacy Policy
            </Button>
          </CardContent>
        </Card>

        {/* Logout */}
        <Button
          variant="destructive"
          className="w-full h-12"
          onClick={handleLogout}
        >
          <LogOut className="w-5 h-5 mr-2" />
          Logout
        </Button>

        {/* Version Info */}
        <div className="text-center pt-4">
          <p className="text-xs text-muted-foreground">
            EV Sense v1.0.0
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            © 2024 EV Sense. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Settings;
