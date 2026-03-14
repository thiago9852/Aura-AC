// src/context/AACContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Alert } from 'react-native';
import * as Speech from 'expo-speech';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import * as DocumentPicker from 'expo-document-picker';
import { Category, SymbolOrPhrase, SymbolItem, NavigationTab, UserSettings, AgendaItem } from '../types';
import { INITIAL_CATEGORIES } from '../data/vocab';

const DEFAULT_SETTINGS: UserSettings = {
    highContrast: false,
    voiceId: null,
    gridSize: 'medium',
    speakingRate: 1.0,
    doubleClickToSpeak: false,
    speakOnlyOnPlay: false,
    cardDisplayMode: 'both',
};

interface AACContextType {
    activeTab: NavigationTab;
    setActiveTab: (tab: NavigationTab) => void;

    // Funções da Categoria
    categories: Category[];
    addCategory: (data: Omit<Category, 'id' | 'items'>) => void;
    updateCategory: (id: string, data: Partial<Category>) => void;
    deleteCategory: (id: string) => void;

    addSymbolToCategory: (categoryId: string, item: Omit<SymbolItem, 'id'>) => void;
    updateSymbolInCategory: (categoryId: string, symbolId: string, item: Partial<SymbolItem>) => void;
    deleteSymbolFromCategory: (categoryId: string, symbolId: string) => void;
    reorderCategoryItems: (categoryId: string, newOrder: SymbolItem[]) => void;

    // Funções de Favoritos
    favorites: SymbolItem[];
    addFavorite: (item: SymbolItem) => void;
    removeFavorite: (id: string) => void;
    reorderFavorites: (newOrder: SymbolItem[]) => void;

    // Funções da Agenda
    agendaItems: AgendaItem[];
    addAgendaItem: (item: Omit<AgendaItem, 'id'>) => void;
    updateAgendaItem: (id: string, item: Partial<AgendaItem>) => void;
    deleteAgendaItem: (id: string) => void;
    toggleAgendaItem: (id: string) => void;

    sentence: SymbolOrPhrase[];
    addToSentence: (item: SymbolItem) => void;
    removeFromSentence: (tempId: string) => void;
    clearSentence: () => void;

    settings: UserSettings;
    updateSettings: (newSettings: Partial<UserSettings>) => void;
    speak: (text: string) => void;

    // Backup
    exportProfile: () => Promise<void>;
    importProfile: () => Promise<void>;
}

const AACContext = createContext<AACContextType | undefined>(undefined);

export const AACProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [activeTab, setActiveTab] = useState<NavigationTab>('home');
    const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
    const [sentence, setSentence] = useState<SymbolOrPhrase[]>([]);
    const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS);
    const [favorites, setFavorites] = useState<SymbolItem[]>([]);
    const [agendaItems, setAgendaItems] = useState<AgendaItem[]>([]);

    useEffect(() => {
        const load = async () => {
            // Carrega as categorias
            const savedCats = await AsyncStorage.getItem('aac_categories');
            if (savedCats) {
                const parsed: Category[] = JSON.parse(savedCats);
                const mergedCategories = INITIAL_CATEGORIES.map(initialCat => {
                    const savedCat = parsed.find(c => c.id === initialCat.id);
                    // Garante que usamos a cor e o ícone MAIS RECENTES do vocab.ts para as categorias padrão, 
                    // mas preservamos os itens salvos se existirem.
                    return savedCat ? { ...savedCat, color: initialCat.color, icon: initialCat.icon } : initialCat;
                });
                const customCategories = parsed.filter(c => c.isCustom);
                setCategories([...customCategories, ...mergedCategories]);
            } else {
                setCategories(INITIAL_CATEGORIES);
            }

            // Carrega os favoritos
            const savedFavs = await AsyncStorage.getItem('aac_favorites');
            if (savedFavs) setFavorites(JSON.parse(savedFavs));

            // Carrega a agenda
            const savedAgenda = await AsyncStorage.getItem('aac_agenda');
            if (savedAgenda) setAgendaItems(JSON.parse(savedAgenda));

            // Carrega as configurações
            const savedSettings = await AsyncStorage.getItem('aac_settings');
            if (savedSettings) setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(savedSettings) });
        };
        load();
    }, []);

    // Backup
    const exportProfile = async () => {
        try {
            const dataToExport = {
                categories,
                favorites,
                agendaItems,
                settings
            };
            const jsonString = JSON.stringify(dataToExport);
            const fileUri = `${FileSystem.documentDirectory}aac_backup_perfil.json`;

            await FileSystem.writeAsStringAsync(fileUri, jsonString);

            const isAvailable = await Sharing.isAvailableAsync();
            if (isAvailable) {
                await Sharing.shareAsync(fileUri, { dialogTitle: 'Salvar backup do perfil' });
            } else {
                Alert.alert('Erro', 'Compartilhamento não disponível no dispositivo.');
            }
        } catch (error) {
            Alert.alert('Erro', 'Falha ao exportar perfil.');
        }
    };

    const importProfile = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({ type: ['application/json', '*/*'] });

            if (result.canceled) return;

            const fileUri = result.assets[0].uri;
            const jsonString = await FileSystem.readAsStringAsync(fileUri);
            const importedData = JSON.parse(jsonString);

            if (!importedData.categories || !importedData.settings) {
                Alert.alert('Erro', 'Arquivo inválido ou corrompido.');
                return;
            }

            // Sobrescreve os dados
            setCategories(importedData.categories);
            setFavorites(importedData.favorites || []);
            setAgendaItems(importedData.agendaItems || []);
            setSettings(importedData.settings);

            await AsyncStorage.setItem('aac_categories', JSON.stringify(importedData.categories));
            await AsyncStorage.setItem('aac_favorites', JSON.stringify(importedData.favorites || []));
            await AsyncStorage.setItem('aac_agenda', JSON.stringify(importedData.agendaItems || []));
            await AsyncStorage.setItem('aac_settings', JSON.stringify(importedData.settings));

            Alert.alert('Sucesso', 'Perfil restaurado perfeitamente!');
        } catch (error) {
            Alert.alert('Erro', 'Não foi possível importar o arquivo.');
        }
    };

    // Atualiza as configurações
    const updateSettings = async (newSettings: Partial<UserSettings>) => {
        const updated = { ...settings, ...newSettings };
        setSettings(updated);
        await AsyncStorage.setItem('aac_settings', JSON.stringify(updated));
    };

    // Helpers e storage
    const saveCategories = async (cats: Category[]) => {
        setCategories(cats);
        await AsyncStorage.setItem('aac_categories', JSON.stringify(cats));
    };

    const saveFavorites = async (favs: SymbolItem[]) => {
        setFavorites(favs);
        await AsyncStorage.setItem('aac_favorites', JSON.stringify(favs));
    };

    const saveAgendas = async (items: AgendaItem[]) => {
        setAgendaItems(items);
        await AsyncStorage.setItem('aac_agenda', JSON.stringify(items));
    }

    // CRUD Categoria
    const addCategory = (categoryData: Omit<Category, 'id' | 'items'>) => {
        const newCategory: Category = { id: `custom_${Date.now()}`, items: [], ...categoryData, isCustom: true };
        saveCategories([newCategory, ...categories]);
    };

    const updateCategory = (id: string, data: Partial<Category>) => {
        saveCategories(categories.map(cat => cat.id === id ? { ...cat, ...data } : cat));
    };

    const deleteCategory = (id: string) => {
        saveCategories(categories.filter(c => c.id !== id));
    };

    const reorderCategoryItems = (categoryId: string, newOrder: SymbolItem[]) => {
        saveCategories(categories.map(cat => cat.id === categoryId ? { ...cat, items: newOrder } : cat));
    };

    // CRUD Símbolos
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
        setFavorites(prev => prev.map(f => f.id === symbolId ? { ...f, ...itemData } : f));
    };

    const deleteSymbolFromCategory = (categoryId: string, symbolId: string) => {
        const updated = categories.map(cat => {
            if (cat.id !== categoryId) return cat;
            return { ...cat, items: cat.items.filter(sym => sym.id !== symbolId) };
        });
        saveCategories(updated);
        removeFavorite(symbolId);
    }

    // CRUD Favoritos
    const addFavorite = (item: SymbolItem) => {
        if (!favorites.find(f => f.id === item.id)) {
            saveFavorites([...favorites, item]);
        }
    };

    const removeFavorite = (id: string) => {
        saveFavorites(favorites.filter(f => f.id !== id));
    };

    const reorderFavorites = (newOrder: SymbolItem[]) => { saveFavorites(newOrder); };

    // CRUD Agenda
    const addAgendaItem = (itemData: Omit<AgendaItem, 'id'>) => {
        saveAgendas([...agendaItems, { id: `agenda_${Date.now()}`, ...itemData }])
    }

    const updateAgendaItem = (id: string, itemData: Partial<AgendaItem>) => {
        saveAgendas(agendaItems.map(item => item.id === id ? { ...item, ...itemData } : item));
    }

    const deleteAgendaItem = (id: string) => {
        saveAgendas(agendaItems.filter(item => item.id !== id));
    };

    const toggleAgendaItem = (id: string) => {
        saveAgendas(agendaItems.map(item => item.id === id ? { ...item, completed: !item.completed } : item));
    };

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
            rate: settings.speakingRate,
            voice: settings.voiceId || undefined
        });
    };

    return (
        <AACContext.Provider value={{
            activeTab, setActiveTab,
            categories, addCategory, updateCategory, deleteCategory,
            addSymbolToCategory, updateSymbolInCategory, deleteSymbolFromCategory, reorderCategoryItems,
            favorites, addFavorite, removeFavorite, reorderFavorites,
            agendaItems, addAgendaItem, deleteAgendaItem, toggleAgendaItem, updateAgendaItem,
            sentence, addToSentence, removeFromSentence, clearSentence,
            settings, updateSettings, speak, exportProfile, importProfile
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