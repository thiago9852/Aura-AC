// src/components/modals/CreateCategoryModal.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { 
    X, MessageCircle, Heart, Star, Smile, Utensils, Home, Gamepad, Music, Sun,
    Dumbbell, Hospital, BookMarked, Laptop, PenTool, Coffee, ShoppingCart,
    Calendar, Bell, Plane, MapPin, Globe, Bus, Briefcase, Film
} from 'lucide-react-native';
import { useAAC } from '../../context/AACContext';
import { Category } from '../../types';
import { useTheme } from '../../theme/useTheme';

const AVAILABLE_ICONS = [
  { name: 'Dumbbell', Icon: Dumbbell },       
  { name: 'Heartbeat', Icon: Heart },         
  { name: 'Hospital', Icon: Hospital },       
  { name: 'BookMarked', Icon: BookMarked },       
  { name: 'Laptop', Icon: Laptop },           
  { name: 'Utensils', Icon: Utensils },     
  { name: 'PenTool', Icon: PenTool },  

  { name: 'Gamepad', Icon: Gamepad },
  { name: 'Music', Icon: Music },
  { name: 'Film', Icon: Film },
  { name: 'Coffee', Icon: Coffee },

  { name: 'Home', Icon: Home },
  { name: 'ShoppingCart', Icon: ShoppingCart },
  { name: 'Calendar', Icon: Calendar },
  { name: 'Sun', Icon: Sun },
  { name: 'Bell', Icon: Bell },

  { name: 'Plane', Icon: Plane },
  { name: 'MapPin', Icon: MapPin },
  { name: 'Globe', Icon: Globe },
  { name: 'Bus', Icon: Bus },
  { name: 'Suitcase', Icon: Briefcase },

  { name: 'Star', Icon: Star },
  { name: 'Smile', Icon: Smile },
  { name: 'MessageCircle', Icon: MessageCircle },
];

const COLORS = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#a855f7', '#ec4899', '#64748b'];

interface Props {
    visible: boolean;
    onClose: () => void;
    editingCategory?: Category | null;
}

export default function CreateCategoryModal({ visible, onClose, editingCategory }: Props) {
    const { addCategory, updateCategory } = useAAC();
    const { colors, isDark } = useTheme();
    
    const [name, setName] = useState('');
    const [selectedIcon, setSelectedIcon] = useState('MessageCircle');
    const [selectedColor, setSelectedColor] = useState('#3b82f6');

    useEffect(() => {
        if (visible) {
            if (editingCategory) {
                setName(editingCategory.name);
                setSelectedIcon(editingCategory.icon);
                setSelectedColor(editingCategory.color);
            } else {
                setName('');
                setSelectedIcon('MessageCircle');
                setSelectedColor('#3b82f6');
            }
        }
    }, [visible, editingCategory]);

    const handleSave = () => {
        if (!name.trim()) return;

        if (editingCategory) {
            updateCategory(editingCategory.id, { name, icon: selectedIcon, color: selectedColor });
        } else {
            addCategory({ name, icon: selectedIcon, color: selectedColor });
        }
        
        onClose();
    };

    return (
        <Modal visible={visible} animationType="slide" transparent>
            <View style={[styles.overlay, { backgroundColor: colors.overlay }]}>
                <View style={[styles.modal, { backgroundColor: colors.background }]}>
                    <View style={styles.header}>
                        <Text style={[styles.title, { color: colors.text }]}>
                            {editingCategory ? 'Editar Categoria' : 'Nova Categoria'}
                        </Text>
                        <TouchableOpacity onPress={onClose} style={[styles.closeBtn, { backgroundColor: isDark ? colors.border : '#e2e8f0', borderColor: isDark ? colors.textMuted : '#cbd5e1' }]}>
                            <X size={20} color={colors.textSecondary} />
                        </TouchableOpacity>
                    </View>

                    <Text style={[styles.label, { color: colors.textSecondary }]}>Nome</Text>
                    <TextInput 
                        style={[styles.input, { borderColor: colors.border, color: colors.text }]} 
                        placeholder="Ex: Escola, Lazer..."
                        placeholderTextColor={colors.textMuted}
                        value={name}
                        onChangeText={setName}
                    />

                    <Text style={[styles.label, { color: colors.textSecondary }]}>Ícone</Text>
                    <View style={styles.row}>
                        {AVAILABLE_ICONS.map(({ name: iconName, Icon }) => (
                            <TouchableOpacity 
                                key={iconName} 
                                style={[styles.iconBtn, { borderColor: colors.border, backgroundColor: isDark ? colors.border : '#f1f5f9' }, selectedIcon === iconName && [styles.selected, { backgroundColor: colors.primary, borderColor: colors.primary }]]}
                                onPress={() => setSelectedIcon(iconName)}
                            >
                                <Icon size={24} color={selectedIcon === iconName ? 'white' : colors.textSecondary} />
                            </TouchableOpacity>
                        ))}
                    </View>

                    <Text style={[styles.label, { color: colors.textSecondary }]}>Cor</Text>
                    <View style={styles.row}>
                        {COLORS.map(color => (
                            <TouchableOpacity 
                                key={color} 
                                style={[styles.colorBtn, { backgroundColor: color }, selectedColor === color && [styles.selectedColor, { borderColor: colors.text }]]}
                                onPress={() => setSelectedColor(color)}
                            />
                        ))}
                    </View>

                    <TouchableOpacity style={[styles.saveBtn, { backgroundColor: colors.primary }]} onPress={handleSave}>
                        <Text style={styles.saveText}>
                            {editingCategory ? 'Salvar Alterações' : 'Criar Categoria'}
                        </Text>
                    </TouchableOpacity>
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
    label: { fontSize: 14, fontWeight: '600', marginBottom: 8, marginTop: 12 },
    input: { borderWidth: 1, borderRadius: 12, padding: 12, fontSize: 16 },
    row: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
    iconBtn: { padding: 10, borderRadius: 12, borderWidth: 1 },
    selected: {},
    colorBtn: { width: 32, height: 32, borderRadius: 16 },
    selectedColor: { borderWidth: 3 },
    saveBtn: { padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 24 },
    saveText: { color: 'white', fontWeight: 'bold', fontSize: 16 }
});