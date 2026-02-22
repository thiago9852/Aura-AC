import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Speech from 'expo-speech';
import { UserSettings, Category, SymbolOrPhrase, SymbolItem, NavigationTab } from '../types';
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

    // Carregar categorias personalizadas
    useEffect(() => {
        const loadData = async () => {
            const savedCats = await AsyncStorage.getItem('@aura_categories');
            if (savedCats) setCategories(JSON.parse(savedCats));
        };
        loadData();
    }, []);

    // Converte texto em voz (TTS)
    const speak = (text: string) => {
        if (!text) return;
        Speech.speak(text, {
            language: 'pt-BR',
            rate: settings.speakingRate,
            voice: settings.voiceId || undefined
        });
    };

    // Gerencia a navegação interna da Home
    const navigateToCategory = (id: string) => setActiveCategoryId(id);

    // Retorna à visualização principal da Home
    const goBack = () => setActiveCategoryId(null);

    // Adiciona um símbolo à barra de construção de frases e aciona a fala do item selecionado.
    const addToSentence = (item: SymbolItem) => {
        setSentence((prev: any) => [...prev, { ...item, tempId: `${item.id}_${Date.now()}` }]);
        speak(item.speechText || item.label);
    };

    // Remove todos os itens da barra de sentença atual.
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