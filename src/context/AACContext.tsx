import React, { createContext, useContext, useState, ReactNode } from 'react';
import * as Speech from 'expo-speech';
import { UserSettings, Category, SymbolOrPhrase, SymbolItem, NavigationTab } from '../types';
import { INITIAL_CATEGORIES } from '../data/vocab';

const DEFAULT_SETTINGS: UserSettings = {
    highContrast: false,
    voiceId: null,
    gridSize: 'medium',
    speakingRate: 1.0,
    darkMode: false,
    showTextOnly: false,
    doubleClickToSpeak: false,
    speakOnlyOnPlay: false
};

interface AACContextType {
    activeTab: NavigationTab;
    setActiveTab: (tab: NavigationTab) => void;
    categories: Category[];
    activeCategoryId: string | null;
    navigateToCategory: (id: string | null) => void;
    goBack: () => void;
    sentence: SymbolOrPhrase[];
    addToSentence: (item: SymbolItem) => void;
    removeFromSentence: (tempId: string) => void;
    clearSentence: () => void;
    settings: UserSettings;
    speak: (text: string) => void;
}

const AACContext = createContext<AACContextType | undefined>(undefined);

export const AACProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [activeTab, setActiveTab] = useState<NavigationTab>('home');
    const [categories] = useState<Category[]>(INITIAL_CATEGORIES);
    const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);
    const [sentence, setSentence] = useState<SymbolOrPhrase[]>([]);
    const [settings] = useState<UserSettings>(DEFAULT_SETTINGS);

    const navigateToCategory = (id: string | null) => setActiveCategoryId(id);
    const goBack = () => setActiveCategoryId(null);

    const speak = (text: string) => {
        Speech.speak(text, {
            voice: settings.voiceId || undefined,
            rate: settings.speakingRate,
        });
    };

    const addToSentence = (item: SymbolItem) => {
        const newItem = { ...item, tempId: `phrase_${Date.now()}_${Math.random()}` };
        setSentence(prev => [...prev, newItem]);
        
        // No futuro, isso respeitará a config 'speakOnlyOnPlay'
        if (!settings.speakOnlyOnPlay) {
            speak(item.speechText || item.label);
        }
    };

    const removeFromSentence = (tempId: string) => 
        setSentence(prev => prev.filter(i => i.tempId !== tempId));

    const clearSentence = () => setSentence([]);

    return (
        <AACContext.Provider value={{
            activeTab, setActiveTab,
            categories, activeCategoryId, navigateToCategory, goBack,
            sentence, addToSentence, removeFromSentence, clearSentence,
            settings, speak
        }}>
            {children}
        </AACContext.Provider>
    );
};

export const useAAC = () => {
    const context = useContext(AACContext);
    if (!context) throw new Error('useAAC must be used within AACProvider');
    return context;
};