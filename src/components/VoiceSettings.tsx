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
import { Volume2, Globe } from 'lucide-react';
import { useState, useMemo } from 'react';

export const VoiceSettings = () => {
  const { voiceSettings, setVoiceSettings, availableVoices, appLanguage, setAppLanguage } = useEV();
  const [genderFilter, setGenderFilter] = useState<'all' | 'female' | 'male'>(voiceSettings.genderFilter || 'female');

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
    setAppLanguage(language);
  };

  const handleGenderFilterChange = (gender: 'all' | 'female' | 'male') => {
    setGenderFilter(gender);
    setVoiceSettings({
      ...voiceSettings,
      genderFilter: gender,
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

  // Extended language list with Indian languages
  const languages = [
    // English Variants
    { code: 'en-US', name: '🇺🇸 English (US)' },
    { code: 'en-GB', name: '🇬🇧 English (UK)' },
    { code: 'en-IN', name: '🇮🇳 English (India)' },
    { code: 'en-AU', name: '🇦🇺 English (Australia)' },
    
    // Indian Languages
    { code: 'hi-IN', name: '🇮🇳 हिंदी (Hindi)' },
    { code: 'ta-IN', name: '🇮🇳 தமிழ் (Tamil)' },
    { code: 'te-IN', name: '🇮🇳 తెలుగు (Telugu)' },
    { code: 'ml-IN', name: '🇮🇳 മലയാളം (Malayalam)' },
    
    // Other Languages
    { code: 'es-ES', name: '🇪🇸 Español (Spanish)' },
    { code: 'fr-FR', name: '🇫🇷 Français (French)' },
    { code: 'de-DE', name: '🇩🇪 Deutsch (German)' },
  ];

  // Filter voices based on selected language and gender
  const filteredVoices = useMemo(() => {
    return availableVoices.filter((voice) => {
      const matchesLanguage = voice.lang.startsWith(voiceSettings.language.split('-')[0]);
      const matchesGender = genderFilter === 'all' || voice.gender === genderFilter;
      return matchesLanguage && matchesGender;
    });
  }, [availableVoices, voiceSettings.language, genderFilter]);

  const currentLanguageName = languages.find(lang => lang.code === voiceSettings.language)?.name || voiceSettings.language;

  return (
    <Card className="border-2">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Volume2 className="w-5 h-5 text-primary" />
          Voice Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Voice Gender Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium flex items-center gap-2">
            👩👨 Voice Gender
          </label>
          <Select
            value={genderFilter}
            onValueChange={(value) => handleGenderFilterChange(value as 'all' | 'female' | 'male')}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="female">👩 Female</SelectItem>
              <SelectItem value="male">👨 Male</SelectItem>
              <SelectItem value="all">🔀 All Voices</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            Found {filteredVoices.length} voice(s) for {genderFilter === 'all' ? 'all' : genderFilter} gender
          </p>
        </div>

        {/* Language Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium flex items-center gap-2">
            <Globe className="w-4 h-4" />
            Language
          </label>
          <Select
            value={voiceSettings.language}
            onValueChange={handleLanguageChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a language" />
            </SelectTrigger>
            <SelectContent className="max-h-[300px]">
              {languages.map((lang) => (
                <SelectItem key={lang.code} value={lang.code}>
                  {lang.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="p-2 bg-blue-50 dark:bg-blue-950 rounded-md border border-blue-200 dark:border-blue-800">
            <p className="text-xs text-blue-900 dark:text-blue-200">
              <strong>Current:</strong> {currentLanguageName}
            </p>
          </div>
        </div>

        {/* Voice Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Voice</label>
          {filteredVoices.length > 0 ? (
            <Select
              value={voiceSettings.voiceIndex.toString()}
              onValueChange={(value) => handleVoiceChange(Number(value))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a voice" />
              </SelectTrigger>
              <SelectContent>
                {filteredVoices.map((voice, index) => (
                  <SelectItem key={`${voice.name}-${index}`} value={index.toString()}>
                    {voice.gender === 'female' ? '👩' : voice.gender === 'male' ? '👨' : '🎙️'} {voice.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <div className="p-2 bg-yellow-50 dark:bg-yellow-950 rounded-md border border-yellow-200 dark:border-yellow-800">
              <p className="text-xs text-yellow-900 dark:text-yellow-200">
                No voices available for this language and gender combination. Try changing the gender filter.
              </p>
            </div>
          )}
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

        {/* Language Info */}
        <div className="p-3 bg-green-50 dark:bg-green-950 rounded-md border border-green-200 dark:border-green-800">
          <p className="text-xs text-green-900 dark:text-green-200">
            <strong>✓ Supported Languages:</strong> English, हिंदी, தமிழ், తెలుగు, മലയാളം + Spanish, French, German
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
