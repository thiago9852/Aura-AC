import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Speech from 'expo-speech';
import { User, UserSettings, Category, SymbolOrPhrase, SymbolItem, NavigationTab } from '../types/types';
import { INITIAL_CATEGORIES } from '../data/vocab';

// Configuração padrão para quando não houver usuário logado
const DEFAULT_SETTINGS: UserSettings = {
    highContrast: false,
    voiceId: null,
    gridSize: 'medium',
    speakingRate: 1.0,
    darkMode: false,
    showTextOnly: false
};

interface AACContextType {
    user: User | null;
    activeTab: NavigationTab;
    setActiveTab: (tab: NavigationTab) => void;
    categories: Category[];
    activeCategoryId: string | null;
    setActiveCategoryId: (id: string | null) => void;
    sentence: SymbolOrPhrase[];
    addToSentence: (item: SymbolItem) => void;
    removeFromSentence: (tempId: string) => void;
    clearSentence: () => void;
    settings: UserSettings; // Exposto separadamente para facilidade
    speak: (text: string) => void;
}

const AACContext = createContext<AACContextType | undefined>(undefined);

export const AACProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [activeTab, setActiveTab] = useState<NavigationTab>('home');
    const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
    const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);
    const [sentence, setSentence] = useState<SymbolOrPhrase[]>([]);
    
    // Usamos settings do usuário se existir, senão usa padrão
    const settings = user?.settings || DEFAULT_SETTINGS;

    const addToSentence = (item: SymbolItem) => {
        setSentence(prev => [...prev, { ...item, tempId: Date.now().toString() + Math.random() }]);
    };

    const removeFromSentence = (tempId: string) => {
        setSentence(prev => prev.filter(i => i.tempId !== tempId));
    };

    const clearSentence = () => setSentence([]);

    const speak = (text: string) => {
        Speech.speak(text, { 
            language: 'pt-BR',
            rate: settings.speakingRate 
        });
    };

    // Carregar dados (simplificado)
    useEffect(() => {
        const load = async () => {
            const savedCats = await AsyncStorage.getItem('aac_categories');
            if (savedCats) setCategories(JSON.parse(savedCats));
        };
        load();
    }, []);

    return (
        <AACContext.Provider value={{
            user, activeTab, setActiveTab,
            categories, activeCategoryId, setActiveCategoryId,
            sentence, addToSentence, removeFromSentence, clearSentence,
            settings, speak
        }}>
            {children}
        </AACContext.Provider>
    );
};

export const useAAC = () => {
    const context = useContext(AACContext);
    if (!context) throw new Error('useAAC must be used within an AACProvider');
    return context;
};