import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface EVStation {
  id: string;
  name: string;
  location: string;
  distance: number;
  power: string;
  connectors: string[];
  slots: number;
  price: number;
  address: string;
  latitude: number;
  longitude: number;
}

interface BatteryData {
  soc: number;
  soh: number;
  temperature: number;
  dte: number;
  status: 'Normal' | 'Low Battery' | 'Overheating';
}

interface User {
  email: string;
  vehicleId: string;
}

interface VoiceSettings {
  voiceIndex: number;
  rate: number;
  pitch: number;
  volume: number;
  language: string;
  genderFilter: 'all' | 'female' | 'male';
}

interface VoiceInfo {
  name: string;
  lang: string;
  voice: SpeechSynthesisVoice;
  gender?: string;
}

interface EVContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  batteryData: BatteryData;
  setBatteryData: (data: BatteryData) => void;
  stations: EVStation[];
  notifications: Array<{ id: string; type: string; message: string; time: string }>;
  addNotification: (notification: { type: string; message: string }) => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  voiceAssistantActive: boolean;
  setVoiceAssistantActive: (active: boolean) => void;
  speak: (message: string) => void;
  searchRadius: number;
  setSearchRadius: (radius: number) => void;
  voiceSettings: VoiceSettings;
  setVoiceSettings: (settings: VoiceSettings) => void;
  availableVoices: VoiceInfo[];
  appLanguage: string;
  setAppLanguage: (language: string) => void;
}

const EVContext = createContext<EVContextType | undefined>(undefined);

const mockStations: EVStation[] = [
  {
    id: '1',
    name: 'Tata Power EZ Charge',
    location: 'Anna Nagar',
    distance: 1.4,
    power: '30 kW DC',
    connectors: ['CCS2'],
    slots: 2,
    price: 18,
    address: '123 Anna Nagar Main Rd',
    latitude: 13.0869,
    longitude: 80.2093,
  },
  {
    id: '2',
    name: 'Zeon Charging Station',
    location: 'Tambaram',
    distance: 2.1,
    power: '50 kW DC',
    connectors: ['CCS2', 'Type-2'],
    slots: 1,
    price: 22,
    address: '456 GST Rd, Tambaram',
    latitude: 12.9229,
    longitude: 80.1275,
  },
  {
    id: '3',
    name: 'Ather Grid',
    location: 'T Nagar',
    distance: 0.8,
    power: '7.4 kW AC',
    connectors: ['Type-2'],
    slots: 3,
    price: 12,
    address: 'Pondy Bazaar, T Nagar',
    latitude: 13.0418,
    longitude: 80.2341,
  },
  {
    id: '4',
    name: 'Exicom Charging Hub',
    location: 'Velachery',
    distance: 3.5,
    power: '60 kW DC',
    connectors: ['CCS2', 'CHAdeMO'],
    slots: 4,
    price: 25,
    address: 'Velachery Main Rd',
    latitude: 12.9750,
    longitude: 80.2207,
  },
  {
    id: '5',
    name: 'ChargeZone Station',
    location: 'OMR',
    distance: 5.2,
    power: '120 kW DC',
    connectors: ['CCS2'],
    slots: 2,
    price: 30,
    address: 'Old Mahabalipuram Rd',
    latitude: 12.9142,
    longitude: 80.2273,
  },
];

// Detect voice gender from voice name
const detectVoiceGender = (voiceName: string): string => {
  const lowerName = voiceName.toLowerCase();
  const femaleIndicators = ['female', 'woman', 'samantha', 'victoria', 'karen', 'moira', 'zira', 'siri', 'asha', 'heera', 'anjali', 'neha'];
  const maleIndicators = ['male', 'man', 'alex', 'bruce', 'fred', 'ralph', 'rishi', 'arjun', 'raj', 'amit'];
  
  if (femaleIndicators.some(indicator => lowerName.includes(indicator))) {
    return 'female';
  }
  if (maleIndicators.some(indicator => lowerName.includes(indicator))) {
    return 'male';
  }
  return 'unknown';
};

export const EVProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [voiceAssistantActive, setVoiceAssistantActive] = useState(true);
  const [searchRadius, setSearchRadius] = useState(5);
  const [availableVoices, setAvailableVoices] = useState<VoiceInfo[]>([]);
  const [appLanguage, setAppLanguage] = useState('en-IN');
  const [voiceSettings, setVoiceSettings] = useState<VoiceSettings>({
    voiceIndex: 0,
    rate: 0.9,
    pitch: 1,
    volume: 1,
    language: 'en-IN',
    genderFilter: 'female',
  });

  const [batteryData, setBatteryData] = useState<BatteryData>({
    soc: 78,
    soh: 94,
    temperature: 32,
    dte: 245,
    status: 'Normal',
  });

  const [notifications, setNotifications] = useState([
    { id: '1', type: 'info', message: 'Welcome to EV Sense!', time: 'Just now' },
  ]);

  // Load available voices and filter by gender
  useEffect(() => {
    const loadVoices = () => {
      if ('speechSynthesis' in window) {
        const voices = window.speechSynthesis.getVoices();
        const voiceInfos: VoiceInfo[] = voices
          .map((voice) => ({
            name: voice.name,
            lang: voice.lang,
            voice,
            gender: detectVoiceGender(voice.name),
          }))
          .filter((voiceInfo) => {
            // Filter for female voices by default
            if (voiceSettings.genderFilter === 'female') {
              return voiceInfo.gender === 'female';
            } else if (voiceSettings.genderFilter === 'male') {
              return voiceInfo.gender === 'male';
            }
            return true; // Show all voices
          });
        setAvailableVoices(voiceInfos);

        // Set default voice index if available
        if (voiceInfos.length > 0) {
          setVoiceSettings(prev => ({ ...prev, voiceIndex: 0 }));
        }
      }
    };

    loadVoices();

    // Listen for voice list changes
    if ('speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }

    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.onvoiceschanged = null;
      }
    };
  }, [voiceSettings.genderFilter]);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Simulate battery changes
  useEffect(() => {
    const interval = setInterval(() => {
      setBatteryData(prev => {
        const newSoc = Math.max(10, prev.soc - Math.random() * 0.5);
        const newTemp = 30 + Math.random() * 10;
        const newDte = Math.round(newSoc * 3.2);

        let status: 'Normal' | 'Low Battery' | 'Overheating' = 'Normal';
        if (newSoc < 20) status = 'Low Battery';
        if (newTemp > 45) status = 'Overheating';

        return {
          ...prev,
          soc: Math.round(newSoc * 10) / 10,
          temperature: Math.round(newTemp),
          dte: newDte,
          status,
        };
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Check for low battery notifications
  useEffect(() => {
    if (batteryData.soc < 20 && batteryData.soc > 19) {
      addNotification({
        type: 'warning',
        message: `Low Battery Alert: SOC at ${Math.round(batteryData.soc)}%`,
      });

      if (voiceAssistantActive) {
        const nearestStation = mockStations[0];
        speak(`Warning: Low battery at ${Math.round(batteryData.soc)}%. The closest charger is ${nearestStation.name} at ${nearestStation.distance} kilometers.`);
      }
    }

    if (batteryData.temperature > 45) {
      addNotification({
        type: 'error',
        message: `Battery Overheat: ${batteryData.temperature}°C`,
      });
    }
  }, [batteryData.soc, batteryData.temperature]);

  const addNotification = (notification: { type: string; message: string }) => {
    const newNotification = {
      id: Date.now().toString(),
      ...notification,
      time: 'Just now',
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
  };

  const speak = (message: string) => {
    if (voiceAssistantActive && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(message);

      // Apply voice settings
      utterance.rate = voiceSettings.rate;
      utterance.pitch = voiceSettings.pitch;
      utterance.volume = voiceSettings.volume;
      utterance.lang = voiceSettings.language;

      // Set voice if available
      if (availableVoices.length > 0 && voiceSettings.voiceIndex < availableVoices.length) {
        utterance.voice = availableVoices[voiceSettings.voiceIndex].voice;
      }

      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
      console.log('🎤 Voice Assistant:', message);
    }
  };

  return (
    <EVContext.Provider
      value={{
        user,
        setUser,
        batteryData,
        setBatteryData,
        stations: mockStations,
        notifications,
        addNotification,
        isDarkMode,
        toggleDarkMode,
        voiceAssistantActive,
        setVoiceAssistantActive,
        speak,
        searchRadius,
        setSearchRadius,
        voiceSettings,
        setVoiceSettings,
        availableVoices,
        appLanguage,
        setAppLanguage,
      }}
    >
      {children}
    </EVContext.Provider>
  );
};

export const useEV = () => {
  const context = useContext(EVContext);
  if (context === undefined) {
    throw new Error('useEV must be used within an EVProvider');
  }
  return context;
};
