import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  ChevronLeft, 
  AlertTriangle, 
  Battery, 
  Thermometer,
  TrendingDown,
  MapPin,
  Bell,
  CheckCircle,
} from 'lucide-react';
import { useEV } from '@/contexts/EVContext';
import { Badge } from '@/components/ui/badge';

const Notifications = () => {
  const navigate = useNavigate();
  const { notifications, speak } = useEV();

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'error':
        return <Thermometer className="w-5 h-5 text-destructive" />;
      case 'warning':
        return <Battery className="w-5 h-5 text-warning" />;
      case 'info':
        return <Bell className="w-5 h-5 text-primary" />;
      default:
        return <CheckCircle className="w-5 h-5 text-success" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'error':
        return 'border-l-4 border-l-destructive bg-destructive/5';
      case 'warning':
        return 'border-l-4 border-l-warning bg-warning/5';
      case 'info':
        return 'border-l-4 border-l-primary bg-primary/5';
      default:
        return 'border-l-4 border-l-success bg-success/5';
    }
  };

  const handleReadNotification = (notification: any) => {
    speak(notification.message);
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
            <h1 className="text-xl font-tech font-bold">Notifications</h1>
            <p className="text-xs text-muted-foreground">
              {notifications.length} {notifications.length === 1 ? 'alert' : 'alerts'}
            </p>
          </div>
          <Badge variant="secondary">
            {notifications.filter(n => n.type === 'error' || n.type === 'warning').length} critical
          </Badge>
        </div>
      </div>

      <div className="p-4 space-y-3 max-w-md mx-auto">
        {notifications.length === 0 ? (
          <Card className="p-12 text-center">
            <CheckCircle className="w-16 h-16 mx-auto text-success mb-4" />
            <h3 className="font-tech font-bold text-lg mb-2">All Clear!</h3>
            <p className="text-sm text-muted-foreground">
              No notifications at this time. Your vehicle is operating normally.
            </p>
          </Card>
        ) : (
          notifications.map((notification) => (
            <Card
              key={notification.id}
              className={`p-4 cursor-pointer hover:shadow-lg transition-all ${getNotificationColor(notification.type)}`}
              onClick={() => handleReadNotification(notification)}
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-1">
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <p className="font-semibold text-sm leading-tight">
                      {notification.message}
                    </p>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {notification.time}
                    </span>
                  </div>
                  
                  {notification.type === 'warning' && notification.message.includes('Low Battery') && (
                    <div className="mt-2 pt-2 border-t border-border/50">
                      <p className="text-xs text-muted-foreground mb-2">
                        Nearest charging station: 1.4 km away
                      </p>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 text-xs"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate('/map');
                        }}
                      >
                        <MapPin className="w-3 h-3 mr-1" />
                        Find Charger
                      </Button>
                    </div>
                  )}

                  {notification.type === 'error' && notification.message.includes('Overheat') && (
                    <div className="mt-2 pt-2 border-t border-border/50">
                      <p className="text-xs text-destructive">
                        ⚠️ Reduce speed and enable eco mode
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))
        )}

        {/* Quick Actions */}
        {notifications.some(n => n.type === 'warning' || n.type === 'error') && (
          <Card className="p-4 bg-gradient-to-r from-primary/10 to-accent/10 border-2 border-primary/30">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-primary" />
              Quick Actions
            </h3>
            <div className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start h-auto py-3"
                onClick={() => navigate('/map')}
              >
                <MapPin className="w-4 h-4 mr-3" />
                <div className="text-left flex-1">
                  <div className="text-sm font-medium">Find Nearest Charger</div>
                  <div className="text-xs text-muted-foreground">1.4 km away</div>
                </div>
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start h-auto py-3"
                onClick={() => navigate('/history')}
              >
                <TrendingDown className="w-4 h-4 mr-3" />
                <div className="text-left flex-1">
                  <div className="text-sm font-medium">View Battery History</div>
                  <div className="text-xs text-muted-foreground">Analyze trends</div>
                </div>
              </Button>
            </div>
          </Card>
        )}

        {/* Notification Settings Info */}
        <Card className="p-4 bg-muted/50">
          <p className="text-xs text-muted-foreground">
            💡 Customize notification preferences in{' '}
            <button
              onClick={() => navigate('/settings')}
              className="text-primary hover:underline font-medium"
            >
              Settings
            </button>
          </p>
        </Card>
      </div>
    </div>
  );
};

export default Notifications;
