import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ChevronLeft, 
  TrendingUp,
  Battery,
  Thermometer,
  Gauge,
  Award,
  Calendar,
} from 'lucide-react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

// Mock data for charts
const socData = [
  { time: '00:00', soc: 85 },
  { time: '04:00', soc: 82 },
  { time: '08:00', soc: 75 },
  { time: '12:00', soc: 65 },
  { time: '16:00', soc: 78 },
  { time: '20:00', soc: 80 },
  { time: '23:59', soc: 78 },
];

const sohData = [
  { month: 'Jan', soh: 100 },
  { month: 'Feb', soh: 99 },
  { month: 'Mar', soh: 98 },
  { month: 'Apr', soh: 97 },
  { month: 'May', soh: 96 },
  { month: 'Jun', soh: 95 },
  { month: 'Jul', soh: 94 },
];

const temperatureData = [
  { time: '00:00', temp: 28 },
  { time: '04:00', temp: 25 },
  { time: '08:00', temp: 32 },
  { time: '12:00', temp: 38 },
  { time: '16:00', temp: 35 },
  { time: '20:00', temp: 30 },
  { time: '23:59', temp: 32 },
];

const dteData = [
  { day: 'Mon', dte: 235 },
  { day: 'Tue', dte: 242 },
  { day: 'Wed', dte: 228 },
  { day: 'Thu', dte: 251 },
  { day: 'Fri', dte: 238 },
  { day: 'Sat', dte: 245 },
  { day: 'Sun', dte: 240 },
];

const History = () => {
  const navigate = useNavigate();

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
            <h1 className="text-xl font-tech font-bold">History & Analytics</h1>
            <p className="text-xs text-muted-foreground">Track your EV performance</p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4 max-w-4xl mx-auto">
        {/* Summary Cards */}
        <div className="grid grid-cols-2 gap-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Award className="w-4 h-4 text-accent" />
                Efficiency Score
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-tech font-bold text-accent">92</div>
              <p className="text-xs text-muted-foreground mt-1">+5% this week</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Calendar className="w-4 h-4 text-primary" />
                Avg Daily Range
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-tech font-bold text-primary">241 km</div>
              <p className="text-xs text-muted-foreground mt-1">Last 7 days</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <Tabs defaultValue="soc" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="soc" className="text-xs">SOC</TabsTrigger>
            <TabsTrigger value="soh" className="text-xs">SOH</TabsTrigger>
            <TabsTrigger value="temp" className="text-xs">Temp</TabsTrigger>
            <TabsTrigger value="dte" className="text-xs">DTE</TabsTrigger>
          </TabsList>

          <TabsContent value="soc" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Battery className="w-5 h-5 text-primary" />
                  State of Charge - Today
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <AreaChart data={socData}>
                    <defs>
                      <linearGradient id="socGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis 
                      dataKey="time" 
                      className="text-xs"
                      tick={{ fill: 'hsl(var(--muted-foreground))' }}
                    />
                    <YAxis 
                      className="text-xs"
                      tick={{ fill: 'hsl(var(--muted-foreground))' }}
                      domain={[0, 100]}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="soc" 
                      stroke="hsl(var(--primary))" 
                      fillOpacity={1} 
                      fill="url(#socGradient)" 
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="soh" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-accent" />
                  State of Health - Trend
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={sohData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis 
                      dataKey="month" 
                      className="text-xs"
                      tick={{ fill: 'hsl(var(--muted-foreground))' }}
                    />
                    <YAxis 
                      className="text-xs"
                      tick={{ fill: 'hsl(var(--muted-foreground))' }}
                      domain={[90, 100]}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="soh" 
                      stroke="hsl(var(--accent))" 
                      strokeWidth={3}
                      dot={{ fill: 'hsl(var(--accent))', r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
                <p className="text-xs text-muted-foreground mt-3 text-center">
                  Battery health degradation: 6% over 7 months (within normal range)
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="temp" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Thermometer className="w-5 h-5 text-warning" />
                  Temperature Profile - Today
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <AreaChart data={temperatureData}>
                    <defs>
                      <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--warning))" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="hsl(var(--warning))" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis 
                      dataKey="time" 
                      className="text-xs"
                      tick={{ fill: 'hsl(var(--muted-foreground))' }}
                    />
                    <YAxis 
                      className="text-xs"
                      tick={{ fill: 'hsl(var(--muted-foreground))' }}
                      domain={[20, 50]}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="temp" 
                      stroke="hsl(var(--warning))" 
                      fillOpacity={1} 
                      fill="url(#tempGradient)" 
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="dte" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Gauge className="w-5 h-5 text-success" />
                  Distance to Empty - Weekly
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={dteData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis 
                      dataKey="day" 
                      className="text-xs"
                      tick={{ fill: 'hsl(var(--muted-foreground))' }}
                    />
                    <YAxis 
                      className="text-xs"
                      tick={{ fill: 'hsl(var(--muted-foreground))' }}
                      domain={[200, 260]}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                    />
                    <Bar 
                      dataKey="dte" 
                      fill="hsl(var(--success))" 
                      radius={[8, 8, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Behavior Summary */}
        <Card className="border-2">
          <CardHeader>
            <CardTitle className="text-base">Charging Behavior Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <span className="text-sm">Total charging sessions</span>
              <span className="font-tech font-bold">42</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <span className="text-sm">Avg charging time</span>
              <span className="font-tech font-bold">45 min</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <span className="text-sm">Fast charge usage</span>
              <span className="font-tech font-bold">28%</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <span className="text-sm">Total energy consumed</span>
              <span className="font-tech font-bold">845 kWh</span>
            </div>
          </CardContent>
        </Card>

        {/* Driving Efficiency */}
        <Card className="border-2 bg-gradient-to-br from-accent/10 to-accent/5">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Award className="w-5 h-5 text-accent" />
              Driving Efficiency Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center mb-4">
              <div className="text-6xl font-tech font-bold text-accent mb-2">92</div>
              <p className="text-sm text-muted-foreground">Excellent performance!</p>
            </div>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div>
                <div className="text-2xl font-tech font-bold text-success">A+</div>
                <div className="text-xs text-muted-foreground">Acceleration</div>
              </div>
              <div>
                <div className="text-2xl font-tech font-bold text-primary">A</div>
                <div className="text-xs text-muted-foreground">Braking</div>
              </div>
              <div>
                <div className="text-2xl font-tech font-bold text-accent">A+</div>
                <div className="text-xs text-muted-foreground">Eco Mode</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default History;
