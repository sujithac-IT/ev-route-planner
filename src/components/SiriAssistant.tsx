import { useState, useEffect } from 'react';
import { Mic, MicOff, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useEV } from '@/contexts/EVContext';
import { useToast } from '@/hooks/use-toast';

export const SiriAssistant = () => {
  const [isListening, setIsListening] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  const { stations, batteryData, speak } = useEV();
  const { toast } = useToast();

  const handleVoiceCommand = (command: string) => {
    const lowerCommand = command.toLowerCase();
    
    if (lowerCommand.includes('nearest') || lowerCommand.includes('station') || lowerCommand.includes('charge')) {
      const nearest = stations[0];
      const responseText = `The nearest charging station is ${nearest.name} in ${nearest.location}, ${nearest.distance} kilometers away. It has ${nearest.slots} available slots and charges rupees ${nearest.price} per kilowatt hour.`;
      setResponse(responseText);
      speak(responseText);
    } else if (lowerCommand.includes('battery') || lowerCommand.includes('charge level')) {
      const responseText = `Your battery is at ${Math.round(batteryData.soc)} percent. Distance to empty is ${batteryData.dte} kilometers. Battery health is ${batteryData.soh} percent.`;
      setResponse(responseText);
      speak(responseText);
    } else if (lowerCommand.includes('navigate') || lowerCommand.includes('direction')) {
      const nearest = stations[0];
      const responseText = `Navigating to ${nearest.name}. The distance is ${nearest.distance} kilometers. You will arrive in approximately ${Math.round(nearest.distance * 3)} minutes.`;
      setResponse(responseText);
      speak(responseText);
    } else if (lowerCommand.includes('service') || lowerCommand.includes('maintenance')) {
      const responseText = `Your next service is due in 15 days. Battery health check is recommended in 1 month.`;
      setResponse(responseText);
      speak(responseText);
    } else {
      const responseText = "I can help you find charging stations, check battery status, navigate, or check service schedules. What would you like to know?";
      setResponse(responseText);
      speak(responseText);
    }
  };

  const startListening = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      toast({
        title: 'Voice input not supported',
        description: 'Your browser does not support voice recognition',
        variant: 'destructive',
      });
      return;
    }

    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.lang = 'en-IN';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
      setTranscript('Listening...');
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setTranscript(transcript);
      handleVoiceCommand(transcript);
    };

    recognition.onerror = (event: any) => {
      setIsListening(false);
      toast({
        title: 'Voice recognition error',
        description: 'Please try again',
        variant: 'destructive',
      });
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const handleToggle = () => {
    if (isOpen) {
      setIsOpen(false);
      setTranscript('');
      setResponse('');
    } else {
      setIsOpen(true);
      speak('Hello! How can I assist you today?');
      setResponse('Hello! How can I assist you today?');
    }
  };

  return (
    <>
      {/* Floating Assistant Button */}
      <Button
        size="icon"
        className="fixed bottom-24 right-6 z-50 w-14 h-14 rounded-full shadow-2xl bg-gradient-to-br from-primary to-accent hover:scale-110 transition-transform"
        onClick={handleToggle}
      >
        {isOpen ? <X className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
      </Button>

      {/* Assistant Panel */}
      {isOpen && (
        <Card className="fixed bottom-44 right-6 left-6 max-w-sm mx-auto z-50 p-4 shadow-2xl border-2 animate-in slide-in-from-bottom-5">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-accent rounded-full animate-pulse" />
                <h3 className="font-tech font-bold">AI Assistant</h3>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleToggle}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Response Display */}
            {response && (
              <div className="p-3 bg-primary/10 rounded-lg border border-primary/30">
                <p className="text-sm">{response}</p>
              </div>
            )}

            {/* Transcript Display */}
            {transcript && (
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground italic">{transcript}</p>
              </div>
            )}

            {/* Voice Input Button */}
            <Button
              onClick={startListening}
              disabled={isListening}
              className="w-full"
              size="lg"
            >
              {isListening ? (
                <>
                  <MicOff className="w-5 h-5 mr-2 animate-pulse" />
                  Listening...
                </>
              ) : (
                <>
                  <Mic className="w-5 h-5 mr-2" />
                  Tap to Speak
                </>
              )}
            </Button>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleVoiceCommand('nearest station')}
              >
                Nearest Station
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleVoiceCommand('battery status')}
              >
                Battery Status
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleVoiceCommand('navigate')}
              >
                Navigate
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleVoiceCommand('service schedule')}
              >
                Service Schedule
              </Button>
            </div>
          </div>
        </Card>
      )}
    </>
  );
};
