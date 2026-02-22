import React, { useState } from 'react';
import { View, Text, Modal, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useAAC } from '../../context/AACContext';
import { SymbolItem } from '../../types';

import {
    X, Star, Heart, Smile, Frown, Coffee, Utensils, Apple, Car, Bus,
    Bike, Plane, Home, Building, School, Book, Pencil, Monitor, Phone,
    Music, Gamepad, Tv, Shirt, Clock, Sun, Moon, Cloud, Umbrella, Zap,
    AlertTriangle, Check, HelpCircle, Info, User, Users, Image as ImageIcon
} from 'lucide-react-native';

// Mapeamento dos Ícones para seleção
const AVAILABLE_ICONS = [
    { name: 'Star', Icon: Star }, { name: 'Heart', Icon: Heart }, { name: 'Smile', Icon: Smile },
    { name: 'Frown', Icon: Frown }, { name: 'Coffee', Icon: Coffee }, { name: 'Utensils', Icon: Utensils },
    { name: 'Apple', Icon: Apple }, { name: 'Car', Icon: Car }, { name: 'Bus', Icon: Bus },
    { name: 'Bike', Icon: Bike }, { name: 'Plane', Icon: Plane }, { name: 'Home', Icon: Home },
    { name: 'School', Icon: School }, { name: 'Book', Icon: Book }, { name: 'Pencil', Icon: Pencil },
    { name: 'Phone', Icon: Phone }, { name: 'Music', Icon: Music }, { name: 'Gamepad', Icon: Gamepad },
    { name: 'Tv', Icon: Tv }, { name: 'Clock', Icon: Clock }, { name: 'Sun', Icon: Sun },
    { name: 'Moon', Icon: Moon }, { name: 'Cloud', Icon: Cloud }, { name: 'Zap', Icon: Zap },
    { name: 'Check', Icon: Check }, { name: 'X', Icon: X }, { name: 'User', Icon: User }
];

// Cores Fitzgerald
const COLORS = [
    { code: 'yellow', hex: '#eab308', label: 'Pessoas' },
    { code: 'green', hex: '#22c55e', label: 'Ação/Verbo' },
    { code: 'blue', hex: '#3b82f6', label: 'Descritivo' },
    { code: 'red', hex: '#ef4444', label: 'Emergência' },
    { code: 'white', hex: '#e2e8f0', label: 'Geral' },
    { code: 'purple', hex: '#a855f7', label: 'Social' },
];

interface Props {
    visible: boolean;
    onClose: () => void;
    categoryId: string;
    initialData?: SymbolItem | null;
}

type Mode = 'icon' | 'image' | 'text';

export default function CreateSymbolModal({ visible, onClose, categoryId, initialData }: Props) {
    const { addSymbolToCategory, updateSymbolInCategory } = useAAC();

    // Estados
    const [label, setLabel] = useState('');
    const [mode, setMode] = useState<Mode>('icon');
    const [selectedIcon, setSelectedIcon] = useState('Star');
    const [selectedColorCode, setSelectedColorCode] = useState('white');

    React.useEffect(() => {
        if (visible && initialData) {
            setLabel(initialData.label);
            setSelectedColorCode(initialData.colorCode || 'white');
            if (initialData.iconName) {
                setMode('icon');
                setSelectedIcon(initialData.iconName);
            } else {
                setMode('text');
            }
        } else if (!visible) {
            setLabel('');
            setSelectedIcon('Star');
            setSelectedColorCode('white');
            setMode('icon');
        }
    }, [visible, initialData]);

    const handleSave = () => {
        if (!label.trim()) return;

        const payload = {
            label: label,
            iconName: mode === 'icon' ? selectedIcon : undefined,
            colorCode: selectedColorCode
        };

        if (initialData) {
            updateSymbolInCategory(categoryId, initialData.id, payload);
        } else {
            addSymbolToCategory(categoryId, payload);
        }

        onClose();
    };

    return (
        <Modal visible={visible} animationType="slide" transparent>
            <View style={styles.overlay}>
                <View style={styles.modal}>
                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={styles.title}>Novo Cartão</Text>
                        <TouchableOpacity onPress={onClose}><X size={24} color="#64748b" /></TouchableOpacity>
                    </View>

                    <ScrollView contentContainerStyle={styles.scrollContent}>
                        {/* Input de Texto */}
                        <Text style={styles.label}>Texto do Cartão</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Ex: Água, Banheiro..."
                            value={label}
                            onChangeText={setLabel}
                        />

                        {/* Abas de Tipo */}
                        <Text style={styles.label}>Tipo de Cartão</Text>
                        <View style={styles.tabs}>
                            <TouchableOpacity
                                style={[styles.tab, mode === 'icon' && styles.activeTab]}
                                onPress={() => setMode('icon')}
                            >
                                <Text style={[styles.tabText, mode === 'icon' && styles.activeTabText]}>Ícone</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.tab, mode === 'image' && styles.activeTab]}
                                onPress={() => setMode('image')}
                            >
                                <Text style={[styles.tabText, mode === 'image' && styles.activeTabText]}>Foto</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.tab, mode === 'text' && styles.activeTab]}
                                onPress={() => setMode('text')}
                            >
                                <Text style={[styles.tabText, mode === 'text' && styles.activeTabText]}>Texto</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Conteúdo */}
                        {mode === 'icon' && (
                            <View>
                                <Text style={styles.label}>Escolha um Ícone</Text>
                                <View style={styles.iconsContainerBorder}>
                                    <ScrollView
                                        nestedScrollEnabled={true}
                                        style={{ maxHeight: 220 }}
                                    >
                                        <View style={styles.grid}>
                                            {AVAILABLE_ICONS.map(({ name: iconName, Icon }) => (
                                                <TouchableOpacity
                                                    key={iconName}
                                                    style={[styles.iconBtn, selectedIcon === iconName && styles.selected]}
                                                    onPress={() => setSelectedIcon(iconName)}
                                                >
                                                    <Icon size={24} color={selectedIcon === iconName ? 'white' : '#64748b'} />
                                                </TouchableOpacity>
                                            ))}
                                        </View>
                                    </ScrollView>
                                </View>
                            </View>
                        )}

                        {mode === 'image' && (
                            <View style={styles.placeholderBox}>
                                <ImageIcon size={32} color="#cbd5e1" />
                                <Text style={styles.placeholderText}>Upload de fotos em breve</Text>
                            </View>
                        )}

                        {/* Seleção de Cor */}
                        <Text style={styles.label}>Cor da Borda (Fitzgerald)</Text>
                        <View style={styles.colorRow}>
                            {COLORS.map(c => (
                                <TouchableOpacity
                                    key={c.code}
                                    style={[
                                        styles.colorBtn,
                                        { backgroundColor: c.hex },
                                        selectedColorCode === c.code && styles.selectedColor
                                    ]}
                                    onPress={() => setSelectedColorCode(c.code)}
                                />
                            ))}
                        </View>
                        <Text style={styles.helperText}>
                            Amarelo: Pessoas | Verde: Verbos | Azul: Adjetivos | Vermelho: Emergência | Roxo: Social
                        </Text>

                        {/* Botão Salvar */}
                        <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
                            <Text style={styles.saveText}>Criar Cartão</Text>
                        </TouchableOpacity>
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 20 },
    modal: { backgroundColor: 'white', borderRadius: 20, padding: 20, elevation: 5, maxHeight: '90%' },
    header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10, alignItems: 'center' },
    title: { fontSize: 20, fontWeight: 'bold', color: '#1e293b' },
    scrollContent: { paddingBottom: 20 },

    label: { fontSize: 14, fontWeight: '600', color: '#475569', marginBottom: 8, marginTop: 12 },
    input: { borderWidth: 1, borderColor: '#cbd5e1', borderRadius: 12, padding: 12, fontSize: 16 },

    // Tabs
    tabs: { flexDirection: 'row', backgroundColor: '#f1f5f9', padding: 4, borderRadius: 12, marginBottom: 10 },
    tab: { flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: 8 },
    activeTab: { backgroundColor: 'white', elevation: 1 },
    tabText: { fontWeight: '600', color: '#64748b' },
    activeTabText: { color: '#3b82f6' },

    // Grid de Ícones
    iconsContainerBorder: {
        borderWidth: 2,
        borderColor: '#e2e8f0',
        borderRadius: 12,
        padding: 6,
        backgroundColor: '#f8fafc'
    },
    grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: 'space-between' },
    iconBtn: { width: '16%', height: '16%', aspectRatio: 1, borderRadius: 12, backgroundColor: '#f1f5f9', alignItems: 'center', justifyContent: 'center' },
    selected: { backgroundColor: '#3b82f6' },

    // Cores
    colorRow: { flexDirection: 'row', gap: 12 },
    colorBtn: { width: 32, height: 32, borderRadius: 16 },
    selectedColor: { borderWidth: 3, borderColor: '#1e293b' },
    helperText: { fontSize: 11, color: '#94a3b8', marginTop: 8 },

    // Placeholder Imagem
    placeholderBox: { borderWidth: 2, borderColor: '#e2e8f0', borderStyle: 'dashed', borderRadius: 12, height: 100, alignItems: 'center', justifyContent: 'center', gap: 8 },
    placeholderText: { color: '#94a3b8', fontSize: 12 },

    saveBtn: { backgroundColor: '#22c55e', padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 24 },
    saveText: { color: 'white', fontWeight: 'bold', fontSize: 16 }
});