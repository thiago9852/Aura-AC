import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Speech from 'expo-speech';
import { UserSettings, Category, SymbolOrPhrase, SymbolItem, NavigationTab, AgendaItem } from '../types';
import { INITIAL_CATEGORIES } from '../data/vocab';

const DEFAULT_SETTINGS: UserSettings = {
    highContrast: false,
    voiceId: null,
    gridSize: 'medium',
    darkMode: false,
    speakingRate: 1.0,
    showTextOnly: false,
};

interface AACContextType {
    activeTab: NavigationTab;
    setActiveTab: (tab: NavigationTab) => void;
    categories: Category[];
    activeCategoryId: string | null;
    navigateToCategory: (id: string) => void;
    goBack: () => void;
    sentence: SymbolOrPhrase[];
    addToSentence: (item: SymbolItem) => void;
    clearSentence: () => void;
    speak: (text: string) => void;
    settings: UserSettings;
}

const AACContext = createContext<AACContextType | undefined>(undefined);

export const AACProvider = ({ children }: { children: ReactNode }) => {
    const [activeTab, setActiveTab] = useState<NavigationTab>('home');
    const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
    const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);
    const [sentence, setSentence] = useState<SymbolOrPhrase[]>([]);
    const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS);

    // Carrega categorias salvas no dispositivo
    useEffect(() => {
        const loadData = async () => {
            const savedCats = await AsyncStorage.getItem('@aura_categories');
            if (savedCats) setCategories(JSON.parse(savedCats));
        };
        loadData();
    }, []);

    // Função para gerar voz (TTS)
    const speak = (text: string) => {
        if (!text) return;
        Speech.speak(text, {
            language: 'pt-BR',
            rate: settings.speakingRate,
            voice: settings.voiceId || undefined
        });
    };

    // Funcionalidades (navegação e limpar frase)
    const navigateToCategory = (id: string) => setActiveCategoryId(id);
    const goBack = () => setActiveCategoryId(null);
    const addToSentence = (item: SymbolItem) => {
        setSentence(prev => [...prev, { ...item, tempId: `${item.id}_${Date.now()}` }]);
        speak(item.speechText || item.label);
    };
    const clearSentence = () => setSentence([]);

    return (
        <AACContext.Provider value={{
            activeTab, setActiveTab,
            categories, activeCategoryId, navigateToCategory, goBack,
            sentence, addToSentence, clearSentence,
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