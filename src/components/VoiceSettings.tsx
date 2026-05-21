import { useEV } from '@/contexts/EVContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Volume2 } from 'lucide-react';

export const VoiceSettings = () => {
  const { voiceSettings, setVoiceSettings, availableVoices } = useEV();

  const handleVoiceChange = (voiceIndex: number) => {
    setVoiceSettings({
      ...voiceSettings,
      voiceIndex,
    });
  };

  const handleLanguageChange = (language: string) => {
    setVoiceSettings({
      ...voiceSettings,
      language,
    });
  };

  const handleRateChange = (rate: number[]) => {
    setVoiceSettings({
      ...voiceSettings,
      rate: rate[0],
    });
  };

  const handlePitchChange = (pitch: number[]) => {
    setVoiceSettings({
      ...voiceSettings,
      pitch: pitch[0],
    });
  };

  const handleVolumeChange = (volume: number[]) => {
    setVoiceSettings({
      ...voiceSettings,
      volume: volume[0],
    });
  };

  const languages = [
    { code: 'en-US', name: 'English (US)' },
    { code: 'en-GB', name: 'English (UK)' },
    { code: 'en-IN', name: 'English (India)' },
    { code: 'en-AU', name: 'English (Australia)' },
    { code: 'hi-IN', name: 'Hindi' },
    { code: 'es-ES', name: 'Spanish' },
    { code: 'fr-FR', name: 'French' },
    { code: 'de-DE', name: 'German' },
  ];

  return (
    <Card className="border-2">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Volume2 className="w-5 h-5 text-primary" />
          Voice Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Voice Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Voice</label>
          <Select
            value={voiceSettings.voiceIndex.toString()}
            onValueChange={(value) => handleVoiceChange(Number(value))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a voice" />
            </SelectTrigger>
            <SelectContent>
              {availableVoices.map((voice, index) => (
                <SelectItem key={index} value={index.toString()}>
                  {voice.name} ({voice.lang})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Language Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Language</label>
          <Select
            value={voiceSettings.language}
            onValueChange={handleLanguageChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a language" />
            </SelectTrigger>
            <SelectContent>
              {languages.map((lang) => (
                <SelectItem key={lang.code} value={lang.code}>
                  {lang.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Speech Rate */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <label className="text-sm font-medium">Speech Speed</label>
            <span className="text-xs text-muted-foreground">{voiceSettings.rate.toFixed(1)}x</span>
          </div>
          <Slider
            min={0.5}
            max={2}
            step={0.1}
            value={[voiceSettings.rate]}
            onValueChange={handleRateChange}
            className="w-full"
          />
          <p className="text-xs text-muted-foreground">0.5x (slow) to 2x (fast)</p>
        </div>

        {/* Pitch */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <label className="text-sm font-medium">Voice Pitch</label>
            <span className="text-xs text-muted-foreground">{voiceSettings.pitch.toFixed(1)}</span>
          </div>
          <Slider
            min={0.5}
            max={2}
            step={0.1}
            value={[voiceSettings.pitch]}
            onValueChange={handlePitchChange}
            className="w-full"
          />
          <p className="text-xs text-muted-foreground">0.5 (lower) to 2 (higher)</p>
        </div>

        {/* Volume */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <label className="text-sm font-medium">Volume</label>
            <span className="text-xs text-muted-foreground">{Math.round(voiceSettings.volume * 100)}%</span>
          </div>
          <Slider
            min={0}
            max={1}
            step={0.1}
            value={[voiceSettings.volume]}
            onValueChange={handleVolumeChange}
            className="w-full"
          />
        </div>
      </CardContent>
    </Card>
  );
};
