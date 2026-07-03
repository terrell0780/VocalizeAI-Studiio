import React, { createContext, useContext, useState, useEffect } from 'react';

export interface FrontierApiKeys {
  openAiKey: string;
  groqKey: string;
  deepgramKey: string;
  elevenLabsKey: string;
  localServerUrl: string;
  useNativeBrowserFallback: boolean;
}

interface ApiSettingsContextType {
  keys: FrontierApiKeys;
  setKeys: React.Dispatch<React.SetStateAction<FrontierApiKeys>>;
  updateKey: (provider: keyof FrontierApiKeys, value: string | boolean) => void;
  activeProviderName: string;
}

const defaultKeys: FrontierApiKeys = {
  openAiKey: '',
  groqKey: '',
  deepgramKey: '',
  elevenLabsKey: '',
  localServerUrl: 'ws://localhost:8000/v1/listen',
  useNativeBrowserFallback: true,
};

const ApiSettingsContext = createContext<ApiSettingsContextType | undefined>(undefined);

export const ApiSettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [keys, setKeys] = useState<FrontierApiKeys>(() => {
    const saved = localStorage.getItem('vocalizeai_frontier_keys');
    if (saved) {
      try {
        return { ...defaultKeys, ...JSON.parse(saved) };
      } catch {
        return defaultKeys;
      }
    }
    return defaultKeys;
  });

  useEffect(() => {
    localStorage.setItem('vocalizeai_frontier_keys', JSON.stringify(keys));
  }, [keys]);

  const updateKey = (provider: keyof FrontierApiKeys, value: string | boolean) => {
    setKeys((prev) => ({ ...prev, [provider]: value }));
  };

  const activeProviderName = keys.groqKey
    ? 'Groq LPU Fast-Whisper'
    : keys.openAiKey
    ? 'OpenAI Whisper & GPT-4o'
    : keys.deepgramKey
    ? 'Deepgram Nova-3 Cloud'
    : 'Browser Native Neural WebSpeech API';

  return (
    <ApiSettingsContext.Provider value={{ keys, setKeys, updateKey, activeProviderName }}>
      {children}
    </ApiSettingsContext.Provider>
  );
};

export const useApiSettings = () => {
  const context = useContext(ApiSettingsContext);
  if (!context) {
    throw new Error('useApiSettings must be used within an ApiSettingsProvider');
  }
  return context;
};
