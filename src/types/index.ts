export interface SymbolItem {
    id: string;
    label: string;
    iconName?: string;
    image?: string;
    colorCode?: string;
    speechText?: string;
}

export interface Category {
    id: string;
    icon: string;
    name: string;
    items: SymbolItem[];
    color: string;
    isCustom?: boolean;
}

export interface AgendaItem {
    id: string;
    title: string;
    type: 'event' | 'class' | 'task';
    date: string;
    time?: string;
    completed?: boolean;
    archived?: boolean;
}

export interface UserSettings {
    highContrast: boolean;
    voiceId: string | null;
    gridSize: 'small' | 'medium' | 'large';
    speakingRate: number; // 0.5 até 2
    darkMode: boolean;
    showTextOnly: boolean;
    doubleClickToSpeak?: boolean;
    speakOnlyOnPlay?: boolean;
}

export interface User {
    id: string;
    name: string;
    email: string;
    provider: 'google' | 'apple';
}

export type SymbolOrPhrase = SymbolItem & { tempId: string };

export type NavigationTab = 'home' | 'favorites' | 'agenda' | 'profile' | 'manage';