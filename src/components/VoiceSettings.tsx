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

import { Button } from '@/components/ui/button';

import {
  Volume2,
  Globe,
  Mic,
  Settings2,
  AudioWaveform,
} from 'lucide-react';

import { useMemo, useState } from 'react';

export const VoiceSettings = () => {
  const {
    voiceSettings,
    setVoiceSettings,
    availableVoices,
    setAppLanguage,
  } = useEV();

  const [genderFilter, setGenderFilter] = useState<
    'all' | 'female' | 'male'
  >(voiceSettings.genderFilter || 'female');

  // ----------------------------------------
  // Languages
  // ----------------------------------------
  const languages = [
    { code: 'en-IN', name: 'English (India)' },
    { code: 'en-US', name: 'English (US)' },
    { code: 'en-GB', name: 'English (UK)' },

    { code: 'hi-IN', name: 'Hindi' },
    { code: 'ta-IN', name: 'Tamil' },
    { code: 'te-IN', name: 'Telugu' },
    { code: 'ml-IN', name: 'Malayalam' },

    { code: 'fr-FR', name: 'French' },
    { code: 'de-DE', name: 'German' },
    { code: 'es-ES', name: 'Spanish' },
  ];

  // ----------------------------------------
  // Filter Voices
  // ----------------------------------------
  const filteredVoices = useMemo(() => {
    return availableVoices.filter((voice) => {
      const matchesLanguage = voice.lang
        .toLowerCase()
        .startsWith(
          voiceSettings.language.split('-')[0].toLowerCase()
        );

      const matchesGender =
        genderFilter === 'all' ||
        voice.gender === genderFilter;

      return matchesLanguage && matchesGender;
    });
  }, [
    availableVoices,
    voiceSettings.language,
    genderFilter,
  ]);

  // ----------------------------------------
  // Handlers
  // ----------------------------------------
  const updateSettings = (newSettings: any) => {
    setVoiceSettings({
      ...voiceSettings,
      ...newSettings,
    });
  };

  const handleLanguageChange = (language: string) => {
    updateSettings({ language });
    setAppLanguage(language);
  };

  // ----------------------------------------
  // Voice Testing
  // ----------------------------------------
  const testVoice = () => {
    if (!window.speechSynthesis) return;

    const voice =
      filteredVoices[voiceSettings.voiceIndex];

    if (!voice) return;

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(
      'AI voice assistant activated.'
    );

    utterance.voice = voice;
    utterance.rate = voiceSettings.rate;
    utterance.pitch = voiceSettings.pitch;
    utterance.volume = voiceSettings.volume;

    window.speechSynthesis.speak(utterance);
  };

  return (
    <Card className="w-full border border-border/60 shadow-sm rounded-2xl bg-background">
      {/* Header */}
      <CardHeader className="border-b border-border/50 pb-4">
        <CardTitle className="flex items-center gap-3 text-xl font-semibold">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10">
            <AudioWaveform className="w-5 h-5 text-primary" />
          </div>

          <div>
            <h2 className="text-lg font-semibold">
              AI Voice Configuration
            </h2>

            <p className="text-sm text-muted-foreground font-normal">
              Configure voice assistant preferences
            </p>
          </div>
        </CardTitle>
      </CardHeader>

      {/* Content */}
      <CardContent className="space-y-6 pt-6">

        {/* Language */}
        <div className="space-y-2">
          <label className="text-sm font-medium flex items-center gap-2">
            <Globe className="w-4 h-4 text-muted-foreground" />
            Language
          </label>

          <Select
            value={voiceSettings.language}
            onValueChange={handleLanguageChange}
          >
            <SelectTrigger className="h-11 rounded-xl">
              <SelectValue placeholder="Select language" />
            </SelectTrigger>

            <SelectContent>
              {languages.map((lang) => (
                <SelectItem
                  key={lang.code}
                  value={lang.code}
                >
                  {lang.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Gender */}
        <div className="space-y-2">
          <label className="text-sm font-medium flex items-center gap-2">
            <Mic className="w-4 h-4 text-muted-foreground" />
            Voice Type
          </label>

          <Select
            value={genderFilter}
            onValueChange={(value) => {
              setGenderFilter(
                value as 'all' | 'female' | 'male'
              );

              updateSettings({
                genderFilter: value,
              });
            }}
          >
            <SelectTrigger className="h-11 rounded-xl">
              <SelectValue placeholder="Select voice type" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="female">
                Female Voice
              </SelectItem>

              <SelectItem value="male">
                Male Voice
              </SelectItem>

              <SelectItem value="all">
                All Voices
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Voice */}
        <div className="space-y-2">
          <label className="text-sm font-medium flex items-center gap-2">
            <Volume2 className="w-4 h-4 text-muted-foreground" />
            Voice Model
          </label>

          <Select
            value={voiceSettings.voiceIndex.toString()}
            onValueChange={(value) =>
              updateSettings({
                voiceIndex: Number(value),
              })
            }
          >
            <SelectTrigger className="h-11 rounded-xl">
              <SelectValue placeholder="Select voice model" />
            </SelectTrigger>

            <SelectContent className="max-h-[240px]">
              {filteredVoices.map((voice, index) => (
                <SelectItem
                  key={`${voice.name}-${index}`}
                  value={index.toString()}
                >
                  {voice.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <p className="text-xs text-muted-foreground">
            {filteredVoices.length} voice models available
          </p>
        </div>

        {/* Speech Speed */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">
              Speech Speed
            </label>

            <span className="text-sm text-muted-foreground">
              {voiceSettings.rate.toFixed(1)}x
            </span>
          </div>

          <Slider
            min={0.5}
            max={2}
            step={0.1}
            value={[voiceSettings.rate]}
            onValueChange={(value) =>
              updateSettings({
                rate: value[0],
              })
            }
          />
        </div>

        {/* Pitch */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">
              Voice Pitch
            </label>

            <span className="text-sm text-muted-foreground">
              {voiceSettings.pitch.toFixed(1)}
            </span>
          </div>

          <Slider
            min={0.5}
            max={2}
            step={0.1}
            value={[voiceSettings.pitch]}
            onValueChange={(value) =>
              updateSettings({
                pitch: value[0],
              })
            }
          />
        </div>

        {/* Volume */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">
              Volume
            </label>

            <span className="text-sm text-muted-foreground">
              {Math.round(voiceSettings.volume * 100)}%
            </span>
          </div>

          <Slider
            min={0}
            max={1}
            step={0.1}
            value={[voiceSettings.volume]}
            onValueChange={(value) =>
              updateSettings({
                volume: value[0],
              })
            }
          />
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-border/50">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Settings2 className="w-4 h-4" />
            AI Voice Assistant Settings
          </div>

          <Button
            onClick={testVoice}
            className="rounded-xl px-5"
          >
            Test Voice
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
