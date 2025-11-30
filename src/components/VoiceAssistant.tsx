import { useEffect, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { useEV } from '@/contexts/EVContext';

interface VoiceAssistantProps {
  message?: string;
  autoHide?: boolean;
}

export const VoiceAssistant = ({ message, autoHide = true }: VoiceAssistantProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentMessage, setCurrentMessage] = useState('');
  const { voiceAssistantActive, setVoiceAssistantActive } = useEV();

  useEffect(() => {
    if (message && voiceAssistantActive) {
      setCurrentMessage(message);
      setIsVisible(true);

      if (autoHide) {
        const timer = setTimeout(() => {
          setIsVisible(false);
        }, 5000);

        return () => clearTimeout(timer);
      }
    }
  }, [message, voiceAssistantActive, autoHide]);

  if (!isVisible || !currentMessage) return null;

  return (
    <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 voice-bubble max-w-md">
      <div className="bg-card border-2 border-primary rounded-2xl p-4 shadow-2xl backdrop-blur-sm">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
            <Volume2 className="w-5 h-5 text-primary animate-pulse" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-card-foreground leading-relaxed">{currentMessage}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export const VoiceToggle = () => {
  const { voiceAssistantActive, setVoiceAssistantActive } = useEV();

  return (
    <button
      onClick={() => setVoiceAssistantActive(!voiceAssistantActive)}
      className={`p-2 rounded-full transition-colors ${
        voiceAssistantActive
          ? 'bg-primary text-primary-foreground'
          : 'bg-muted text-muted-foreground'
      }`}
      aria-label="Toggle voice assistant"
    >
      {voiceAssistantActive ? (
        <Volume2 className="w-5 h-5" />
      ) : (
        <VolumeX className="w-5 h-5" />
      )}
    </button>
  );
};
