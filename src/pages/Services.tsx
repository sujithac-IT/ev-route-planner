import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  ChevronLeft,
  Wrench,
  Battery,
  Droplets,
  Wind,
  Filter,
  Calendar,
  AlertCircle,
  CheckCircle,
  Clock,
} from 'lucide-react';
import { useEV } from '@/contexts/EVContext';

interface Service {
  id: string;
  name: string;
  description: string;
  dueDate: string;
  daysUntilDue: number;
  status: 'overdue' | 'due-soon' | 'upcoming';
  icon: any;
  lastCompleted: string;
  intervalDays: number;
}

const Services = () => {
  const navigate = useNavigate();
  const { speak } = useEV();

  const [services] = useState<Service[]>([
    {
      id: '1',
      name: 'Battery Health Check',
      description: 'Comprehensive battery diagnostics and cell balancing',
      dueDate: '2025-12-15',
      daysUntilDue: 15,
      status: 'due-soon',
      icon: Battery,
      lastCompleted: '2025-06-15',
      intervalDays: 180,
    },
    {
      id: '2',
      name: 'Brake System Inspection',
      description: 'Check brake pads, fluid, and regenerative braking system',
      dueDate: '2026-01-20',
      daysUntilDue: 51,
      status: 'upcoming',
      icon: Wrench,
      lastCompleted: '2025-07-20',
      intervalDays: 180,
    },
    {
      id: '3',
      name: 'Coolant System Service',
      description: 'Thermal management system check and coolant replacement',
      dueDate: '2025-11-30',
      daysUntilDue: 0,
      status: 'overdue',
      icon: Droplets,
      lastCompleted: '2024-11-30',
      intervalDays: 365,
    },
    {
      id: '4',
      name: 'HVAC Filter Replacement',
      description: 'Cabin air filter and climate control system inspection',
      dueDate: '2026-02-28',
      daysUntilDue: 90,
      status: 'upcoming',
      icon: Wind,
      lastCompleted: '2025-08-28',
      intervalDays: 180,
    },
    {
      id: '5',
      name: 'High Voltage System Check',
      description: 'Electrical system diagnostics and connection inspection',
      dueDate: '2025-12-25',
      daysUntilDue: 25,
      status: 'due-soon',
      icon: Filter,
      lastCompleted: '2024-12-25',
      intervalDays: 365,
    },
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'overdue':
        return 'bg-destructive text-destructive-foreground';
      case 'due-soon':
        return 'bg-warning text-warning-foreground';
      case 'upcoming':
        return 'bg-success text-success-foreground';
      default:
        return 'bg-muted';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'overdue':
        return <AlertCircle className="w-4 h-4" />;
      case 'due-soon':
        return <Clock className="w-4 h-4" />;
      case 'upcoming':
        return <CheckCircle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const getStatusText = (status: string, days: number) => {
    switch (status) {
      case 'overdue':
        return 'Overdue';
      case 'due-soon':
        return `Due in ${days} days`;
      case 'upcoming':
        return `${days} days remaining`;
      default:
        return '';
    }
  };

  const handleServiceDetails = (service: Service) => {
    const message = `${service.name} is ${getStatusText(service.status, service.daysUntilDue)}. Last completed on ${service.lastCompleted}. ${service.description}`;
    speak(message);
  };

  const overdueCount = services.filter(s => s.status === 'overdue').length;
  const dueSoonCount = services.filter(s => s.status === 'due-soon').length;

  return (
    <div className="min-h-screen bg-background pb-24">
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
            <h1 className="text-xl font-tech font-bold">Service Schedule</h1>
            <p className="text-xs text-muted-foreground">
              {overdueCount > 0 && `${overdueCount} overdue, `}
              {dueSoonCount > 0 && `${dueSoonCount} due soon`}
              {overdueCount === 0 && dueSoonCount === 0 && 'All services up to date'}
            </p>
          </div>
          <Calendar className="w-6 h-6 text-primary" />
        </div>
      </div>

      <div className="p-4 space-y-4 max-w-md mx-auto">
        {/* Summary Card */}
        <Card className="border-2 shadow-lg">
          <CardContent className="p-4">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-tech font-bold text-destructive">
                  {overdueCount}
                </div>
                <div className="text-xs text-muted-foreground">Overdue</div>
              </div>
              <div>
                <div className="text-2xl font-tech font-bold text-warning">
                  {dueSoonCount}
                </div>
                <div className="text-xs text-muted-foreground">Due Soon</div>
              </div>
              <div>
                <div className="text-2xl font-tech font-bold text-success">
                  {services.filter(s => s.status === 'upcoming').length}
                </div>
                <div className="text-xs text-muted-foreground">Upcoming</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Services List */}
        <div className="space-y-3">
          <h2 className="font-tech font-bold flex items-center gap-2">
            <Wrench className="w-5 h-5 text-primary" />
            Maintenance Schedule
          </h2>

          {services
            .sort((a, b) => a.daysUntilDue - b.daysUntilDue)
            .map((service) => {
              const Icon = service.icon;
              const progress = Math.max(
                0,
                Math.min(100, ((service.intervalDays - service.daysUntilDue) / service.intervalDays) * 100)
              );

              return (
                <Card
                  key={service.id}
                  className="border-2 hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => handleServiceDetails(service)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Icon className="w-5 h-5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-base">{service.name}</CardTitle>
                          <p className="text-xs text-muted-foreground mt-1">
                            {service.description}
                          </p>
                        </div>
                      </div>
                      <Badge className={getStatusColor(service.status)}>
                        <div className="flex items-center gap-1">
                          {getStatusIcon(service.status)}
                          <span className="text-xs">
                            {service.status === 'overdue' ? 'Overdue' : 
                             service.status === 'due-soon' ? 'Soon' : 'OK'}
                          </span>
                        </div>
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Service Progress</span>
                        <span className="font-tech font-bold">
                          {getStatusText(service.status, service.daysUntilDue)}
                        </span>
                      </div>
                      <Progress value={progress} className="h-2" />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div className="space-y-1">
                        <div className="text-muted-foreground">Due Date</div>
                        <div className="font-tech font-bold">{service.dueDate}</div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-muted-foreground">Last Service</div>
                        <div className="font-tech font-bold">{service.lastCompleted}</div>
                      </div>
                    </div>

                    <Button
                      variant="outline"
                      className="w-full"
                      size="sm"
                    >
                      Book Service
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default Services;
