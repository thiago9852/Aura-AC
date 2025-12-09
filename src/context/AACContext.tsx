import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Speech from "expo-speech";
import { UserSettings, Category, AgendaItem, User, SymbolItem, SymbolOrPhrase, NavigationTab } from "../types/types";
import { INITIAL_CATEGORIES } from "../data/vocab";

// Define o que o contexto vai expor
interface AACContextType {
    // Estados
    user: User | null;
    categories: Category[];
    sentence: SymbolOrPhrase[];

    // Funções
    speak: (text: string) => void;
    addToSentence: (item: SymbolItem) => void;
    clearSentence: () => void;
}

// Cria o contexto
const AACContext = createContext<AACContextType | null>(null);

// Cria o provedor
export const AACProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
    const [sentence, setSentence] = useState<SymbolOrPhrase[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Carregar dados ao iniciar o App
    useEffect(() => {
        const loadData = async () => {
        try {
            const savedCats = await AsyncStorage.getItem('aac_categories');
            
            if (savedCats) {
                setCategories(JSON.parse(savedCats));
            }
        } catch (e) {
            console.error("Erro ao carregar", e);
        } finally {
            setIsLoading(false);
        }
        };
        loadData();
    }, []);

    // Salvar dados sempre que mudarem
    useEffect(() => {
        if (!isLoading) {
        AsyncStorage.setItem('aac_categories', JSON.stringify(categories));
        }
    }, [categories, isLoading]);

    const speak = (text: string) => {
        Speech.speak(text, { language: 'pt-BR' });
    };

    const addToSentence = (item: SymbolItem) => {
        setSentence(prev => [...prev, { ...item, tempId: Date.now().toString() }]);
    };

    const clearSentence = () => {
        setSentence([]);
    };

    // Retorno
    return (
        <AACContext.Provider value={{
      user,
      categories,
      sentence,
      speak,
      addToSentence,
      clearSentence
    }}>
      {children}
    </AACContext.Provider>
    );
};

// Hook para consumir o contexto
export const useAACContext = () => {
    const context = useContext(AACContext);
    if (!context) {
        throw new Error("useAACContext deve ser usado dentro de um AACProvider");
    }
    return context;
};
