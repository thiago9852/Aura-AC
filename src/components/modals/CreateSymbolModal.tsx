// src/components/modals/CreateSymbolModal.tsx
import React, { useState } from 'react';
import { View, Text, Modal, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useAAC } from '../../context/AACContext';
import { SymbolItem } from '../../types';
import { useTheme } from '../../theme/useTheme';

import {
  X, Star, Heart, Smile, Frown, Coffee, Utensils, Apple, Car, Bus,
  Bike, Plane, Home, Building, School, Book, Pencil, Monitor, Phone,
  Music, Gamepad, Tv, Shirt, Clock, Sun, Moon, Cloud, Umbrella, Zap,
  AlertTriangle, Check, User, Image as ImageIcon, Users, MessageCircle,
  MessageSquare, ThumbsUp, ThumbsDown, HelpCircle, Info, LogOut, Pizza,
  Cookie, IceCream, Sandwich, Soup, Beef, Milk, GlassWater, Wine, Cake,
  Truck, Ambulance, Ship, Navigation, MapPin, Flag, TrainFront, TramFront,
  Map, Store, Hospital, Hotel, Library, Trees, Tent, Factory, Warehouse,
  Lamp, Key, Gift, Scissors, Camera, Lightbulb, Hammer, Backpack, Briefcase,
  Calculator, Snowflake, Rainbow, Flower, Dog, Cat, Bird, Fish, Thermometer,
  Waves, Leaf, Wind, Mountain, Hand, Eye, Ear, Popcorn, Candy, Banana, Lollipop,
  Globe
} from 'lucide-react-native';

const ICON_GROUPS: Record<string, { name: string; Icon: any }[]> = {
  Geral: [
    { name: 'Star', Icon: Star },
    { name: 'Heart', Icon: Heart },
    { name: 'Smile', Icon: Smile },
    { name: 'Frown', Icon: Frown },
    { name: 'User', Icon: User },
    { name: 'Users', Icon: Users },
    { name: 'Hand', Icon: Hand },
    { name: 'Eye', Icon: Eye },
    { name: 'Ear', Icon: Ear },
    { name: 'MessageCircle', Icon: MessageCircle },
    { name: 'MessageSquare', Icon: MessageSquare },
    { name: 'ThumbsUp', Icon: ThumbsUp },
    { name: 'ThumbsDown', Icon: ThumbsDown },
    { name: 'Check', Icon: Check },
    { name: 'X', Icon: X },
    { name: 'Image', Icon: ImageIcon },
    { name: 'HelpCircle', Icon: HelpCircle },
    { name: 'Info', Icon: Info },
    { name: 'LogOut', Icon: LogOut },
  ],
  Comida: [
    { name: 'Coffee', Icon: Coffee },
    { name: 'Utensils', Icon: Utensils },
    { name: 'Apple', Icon: Apple },
    { name: 'Pizza', Icon: Pizza },
    { name: 'Cookie', Icon: Cookie },
    { name: 'IceCream', Icon: IceCream },
    { name: 'Sandwich', Icon: Sandwich },
    { name: 'Soup', Icon: Soup },
    { name: 'Beef', Icon: Beef },
    { name: 'Milk', Icon: Milk },
    { name: 'GlassWater', Icon: GlassWater },
    { name: 'Wine', Icon: Wine },
    { name: 'Cake', Icon: Cake },
    { name: 'Popcorn', Icon: Popcorn },
    { name: 'Candy', Icon: Candy },
    { name: 'Banana', Icon: Banana },
    { name: 'Lollipop', Icon: Lollipop },
  ],
  Transporte: [
    { name: 'Car', Icon: Car },
    { name: 'Bus', Icon: Bus },
    { name: 'Bike', Icon: Bike },
    { name: 'Plane', Icon: Plane },
    { name: 'Truck', Icon: Truck },
    { name: 'Ambulance', Icon: Ambulance },
    { name: 'Ship', Icon: Ship },
    { name: 'Navigation', Icon: Navigation },
    { name: 'MapPin', Icon: MapPin },
    { name: 'Flag', Icon: Flag },
    { name: 'TrainFront', Icon: TrainFront },
    { name: 'TramFront', Icon: TramFront },
  ],
  Lugares: [
    { name: 'Home', Icon: Home },
    { name: 'Building', Icon: Building },
    { name: 'School', Icon: School },
    { name: 'Map', Icon: Map },
    { name: 'Store', Icon: Store },
    { name: 'Hospital', Icon: Hospital },
    { name: 'Hotel', Icon: Hotel },
    { name: 'Library', Icon: Library },
    { name: 'Trees', Icon: Trees },
    { name: 'Tent', Icon: Tent },
    { name: 'Factory', Icon: Factory },
    { name: 'Warehouse', Icon: Warehouse },
    { name: 'Globe', Icon: Globe },
  ],
  Objetos: [
    { name: 'Pencil', Icon: Pencil },
    { name: 'Book', Icon: Book },
    { name: 'Monitor', Icon: Monitor },
    { name: 'Phone', Icon: Phone },
    { name: 'Music', Icon: Music },
    { name: 'Gamepad', Icon: Gamepad },
    { name: 'Tv', Icon: Tv },
    { name: 'Shirt', Icon: Shirt },
    { name: 'Umbrella', Icon: Umbrella },
    { name: 'Lamp', Icon: Lamp },
    { name: 'Key', Icon: Key },
    { name: 'Gift', Icon: Gift },
    { name: 'Scissors', Icon: Scissors },
    { name: 'Camera', Icon: Camera },
    { name: 'Lightbulb', Icon: Lightbulb },
    { name: 'Hammer', Icon: Hammer },
    { name: 'Backpack', Icon: Backpack },
    { name: 'Briefcase', Icon: Briefcase },
    { name: 'Calculator', Icon: Calculator },
    { name: 'Clock', Icon: Clock },
  ],
  'Tempo/Outros': [
    { name: 'Sun', Icon: Sun },
    { name: 'Moon', Icon: Moon },
    { name: 'Cloud', Icon: Cloud },
    { name: 'Snowflake', Icon: Snowflake },
    { name: 'Rainbow', Icon: Rainbow },
    { name: 'Zap', Icon: Zap },
    { name: 'AlertTriangle', Icon: AlertTriangle },
    { name: 'Flower', Icon: Flower },
    { name: 'Dog', Icon: Dog },
    { name: 'Cat', Icon: Cat },
    { name: 'Bird', Icon: Bird },
    { name: 'Fish', Icon: Fish },
    { name: 'Thermometer', Icon: Thermometer },
    { name: 'Waves', Icon: Waves },
    { name: 'Leaf', Icon: Leaf },
    { name: 'Wind', Icon: Wind },
    { name: 'Mountain', Icon: Mountain },
  ],
};


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
    const { colors, isDark } = useTheme();

    const [label, setLabel] = useState('');
    const [mode, setMode] = useState<Mode>('icon');
    const [selectedIcon, setSelectedIcon] = useState('Star');
    const [selectedIconCategory, setSelectedIconCategory] = useState('Geral');
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
            <View style={[styles.overlay, { backgroundColor: colors.overlay }]}>
                <View style={[styles.modal, { backgroundColor: colors.background }]}>
                    <View style={styles.header}>
                        <Text style={[styles.title, { color: colors.text }]}>{initialData ? 'Editar Cartão' : 'Novo Cartão'}</Text>
                        <TouchableOpacity onPress={onClose} style={[styles.closeBtn, { backgroundColor: isDark ? colors.border : '#e2e8f0', borderColor: isDark ? colors.textMuted : '#cbd5e1' }]}>
                            <X size={20} color={colors.textSecondary} />
                        </TouchableOpacity>
                    </View>

                    <ScrollView contentContainerStyle={styles.scrollContent}>
                        <Text style={[styles.label, { color: colors.textSecondary }]}>Texto do Cartão</Text>
                        <TextInput
                            style={[styles.input, { borderColor: colors.border, color: colors.text }]}
                            placeholder="Ex: Água, Banheiro..."
                            placeholderTextColor={colors.textMuted}
                            value={label}
                            onChangeText={setLabel}
                        />

                        <Text style={[styles.label, { color: colors.textSecondary }]}>Tipo de Cartão</Text>
                        <View style={[styles.tabs, { backgroundColor: isDark ? colors.border : '#f1f5f9' }]}>
                            <TouchableOpacity style={[styles.tab, mode === 'icon' && [styles.activeTab, { backgroundColor: colors.card }]]} onPress={() => setMode('icon')}>
                                <Text style={[styles.tabText, { color: colors.textSecondary }, mode === 'icon' && { color: colors.primary }]}>Ícone</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.tab, mode === 'image' && [styles.activeTab, { backgroundColor: colors.card }]]} onPress={() => setMode('image')}>
                                <Text style={[styles.tabText, { color: colors.textSecondary }, mode === 'image' && { color: colors.primary }]}>Foto</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.tab, mode === 'text' && [styles.activeTab, { backgroundColor: colors.card }]]} onPress={() => setMode('text')}>
                                <Text style={[styles.tabText, { color: colors.textSecondary }, mode === 'text' && { color: colors.primary }]}>Texto</Text>
                            </TouchableOpacity>
                        </View>

                        {mode === 'icon' && (
                            <View>
                                <Text style={[styles.label, { color: colors.textSecondary }]}>Escolha um Ícone</Text>
                                
                                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.iconCategories}>
                                    {Object.keys(ICON_GROUPS).map(group => (
                                        <TouchableOpacity 
                                            key={group} 
                                            style={[styles.categoryChip, { backgroundColor: isDark ? colors.border : '#f1f5f9', borderColor: colors.border }, selectedIconCategory === group && [styles.activeCategoryChip, { backgroundColor: colors.primary, borderColor: colors.primary }]]}
                                            onPress={() => setSelectedIconCategory(group)}
                                        >
                                            <Text style={[styles.categoryChipText, { color: colors.textSecondary }, selectedIconCategory === group && styles.activeCategoryChipText]}>{group}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </ScrollView>

                                <View style={[styles.iconsContainerBorder, { borderColor: colors.border, backgroundColor: colors.background }]}>
                                    <ScrollView style={styles.iconsScroll} contentContainerStyle={styles.grid} nestedScrollEnabled={true}>
                                        {ICON_GROUPS[selectedIconCategory].map(({ name: iconName, Icon }) => (
                                            <TouchableOpacity
                                                key={iconName}
                                                style={[styles.iconBtn, { borderColor: colors.border, backgroundColor: isDark ? colors.border : '#f1f5f9' }, selectedIcon === iconName && [styles.selected, { backgroundColor: colors.primary }]]}
                                                onPress={() => setSelectedIcon(iconName)}
                                            >
                                                <Icon size={24} color={selectedIcon === iconName ? 'white' : colors.textSecondary} />
                                            </TouchableOpacity>
                                        ))}
                                    </ScrollView>
                                </View>
                            </View>
                        )}

                        {mode === 'image' && (
                            <View style={[styles.placeholderBox, { borderColor: colors.border }]}>
                                <ImageIcon size={32} color={colors.textMuted} />
                                <Text style={[styles.placeholderText, { color: colors.textMuted }]}>Upload de fotos em breve</Text>
                            </View>
                        )}

                        <Text style={[styles.label, { color: colors.textSecondary }]}>Cor da Borda (Fitzgerald)</Text>
                        <View style={styles.colorRow}>
                            {COLORS.map(c => (
                                <TouchableOpacity
                                    key={c.code}
                                    style={[styles.colorBtn, { backgroundColor: c.hex }, selectedColorCode === c.code && [styles.selectedColor, { borderColor: colors.text }]]}
                                    onPress={() => setSelectedColorCode(c.code)}
                                />
                            ))}
                        </View>
                        <Text style={[styles.helperText, { color: colors.textMuted }]}>Amarelo: Pessoas | Verde: Verbos | Azul: Adjetivos | Vermelho: Emergência | Roxo: Social</Text>

                        <TouchableOpacity style={[styles.saveBtn, { backgroundColor: colors.success }]} onPress={handleSave}>
                            <Text style={styles.saveText}>{initialData ? 'Salvar' : 'Criar Cartão'}</Text>
                        </TouchableOpacity>
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: { flex: 1, justifyContent: 'flex-end' },
    modal: { borderTopLeftRadius: 32, borderTopRightRadius: 32, padding: 24, paddingBottom: 40, elevation: 20 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
    title: { fontSize: 20, fontWeight: 'bold' },
    closeBtn: { padding: 8, borderRadius: 20, borderWidth: 1 },
    scrollContent: { paddingBottom: 20 },
    label: { fontSize: 14, fontWeight: '600', marginBottom: 8, marginTop: 12 },
    input: { borderWidth: 1, borderRadius: 12, padding: 12, fontSize: 16 },
    tabs: { flexDirection: 'row', padding: 4, borderRadius: 12, marginBottom: 10 },
    tab: { flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: 8 },
    activeTab: { elevation: 1 },
    tabText: { fontWeight: '600' },
    iconsContainerBorder: { borderWidth: 2, borderRadius: 12, padding: 6 },
    iconsScroll: { height: 185 },
    grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 15 },
    iconBtn: { width: '15%', height: '16%', aspectRatio: 1, borderRadius: 12, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
    selected: {},
    iconCategories: { marginBottom: 12, flexDirection: 'row' },
    categoryChip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, marginRight: 8, borderWidth: 1 },
    activeCategoryChip: {},
    categoryChipText: { fontSize: 13, fontWeight: '600' },
    activeCategoryChipText: { color: 'white' },
    colorRow: { flexDirection: 'row', gap: 12 },
    colorBtn: { width: 32, height: 32, borderRadius: 16 },
    selectedColor: { borderWidth: 3 },
    helperText: { fontSize: 11, marginTop: 8 },
    placeholderBox: { borderWidth: 2, borderStyle: 'dashed', borderRadius: 12, height: 100, alignItems: 'center', justifyContent: 'center', gap: 8 },
    placeholderText: { fontSize: 12 },
    saveBtn: { padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 24 },
    saveText: { color: 'white', fontWeight: 'bold', fontSize: 16 }
});