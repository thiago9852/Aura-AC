// src/context/AACContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import * as Speech from 'expo-speech';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Category, SymbolOrPhrase, SymbolItem, NavigationTab, UserSettings } from '../types';
import { INITIAL_CATEGORIES } from '../data/vocab';

const DEFAULT_SETTINGS: UserSettings = {
    highContrast: false,
    voiceId: null,
    gridSize: 'medium',
    speakingRate: 1.0,
};

interface AACContextType {
    activeTab: NavigationTab;
    setActiveTab: (tab: NavigationTab) => void;
    
    categories: Category[];
    addCategory: (data: Omit<Category, 'id' | 'items'>) => void;
    updateCategory: (id: string, data: Partial<Category>) => void;
    deleteCategory: (id: string) => void;
    
    activeCategoryId: string | null;
    navigateToCategory: (id: string) => void;
    goBack: () => void;

    // Novas funções para símbolos
    addSymbolToCategory: (categoryId: string, item: Omit<SymbolItem, 'id'>) => void;
    updateSymbolInCategory: (categoryId: string, symbolId: string, item: Partial<SymbolItem>) => void;
    
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
    const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
    const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);
    const [sentence, setSentence] = useState<SymbolOrPhrase[]>([]);
    const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS);

    useEffect(() => {
        const load = async () => {
            const savedCats = await AsyncStorage.getItem('aac_categories');
            if (savedCats) {
                const parsed: Category[] = JSON.parse(savedCats);
                const mergedCategories = INITIAL_CATEGORIES.map(initialCat => {
                    const savedCat = parsed.find(c => c.id === initialCat.id);
                    return savedCat ? savedCat : initialCat;
                });
                const customCategories = parsed.filter(c => c.isCustom);
                setCategories([...customCategories, ...mergedCategories]);
            } else {
                setCategories(INITIAL_CATEGORIES);
            }
        };
        load();
    }, []);

    const saveCategories = async (cats: Category[]) => {
        setCategories(cats);
        await AsyncStorage.setItem('aac_categories', JSON.stringify(cats));
    };

    const addCategory = (categoryData: Omit<Category, 'id' | 'items'>) => {
        const newCategory: Category = { id: `custom_${Date.now()}`, items: [], ...categoryData, isCustom: true };
        saveCategories([newCategory, ...categories]);
    };

    const updateCategory = (id: string, data: Partial<Category>) => {
        saveCategories(categories.map(cat => cat.id === id ? { ...cat, ...data } : cat));
    };

    const deleteCategory = (id: string) => {
        saveCategories(categories.filter(c => c.id !== id));
        if (activeCategoryId === id) goBack();
    };

    // Novas funções de símbolos
    const addSymbolToCategory = (categoryId: string, item: Omit<SymbolItem, 'id'>) => {
        const updated = categories.map(cat => {
            if (cat.id !== categoryId) return cat;
            return { ...cat, items: [...cat.items, { id: `sym_${Date.now()}`, ...item }] };
        });
        saveCategories(updated);
    };

    const updateSymbolInCategory = (categoryId: string, symbolId: string, itemData: Partial<SymbolItem>) => {
        const updated = categories.map(cat => {
            if (cat.id !== categoryId) return cat;
            return {
                ...cat,
                items: cat.items.map(sym => sym.id === symbolId ? { ...sym, ...itemData } : sym)
            };
        });
        saveCategories(updated);
    };

    const navigateToCategory = (id: string) => setActiveCategoryId(id);
    const goBack = () => setActiveCategoryId(null);

    const addToSentence = (item: SymbolItem) => {
        setSentence(prev => [...prev, { ...item, tempId: Date.now().toString() + Math.random() }]);
    };

    const removeFromSentence = (tempId: string) => {
        setSentence(prev => prev.filter(i => i.tempId !== tempId));
    };

    const clearSentence = () => setSentence([]);

    const speak = (text: string) => {
        Speech.speak(text, { language: 'pt-BR', rate: settings.speakingRate });
    };

    return (
        <AACContext.Provider value={{
            activeTab, setActiveTab,
            categories, addCategory, updateCategory, deleteCategory,
            activeCategoryId, navigateToCategory, goBack,
            addSymbolToCategory, updateSymbolInCategory,
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