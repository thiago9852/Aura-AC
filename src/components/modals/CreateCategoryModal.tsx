// src/components/modals/CreateCategoryModal.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { X, MessageCircle, Heart, Star, Smile, Utensils, Home, Gamepad, Music, Sun } from 'lucide-react-native';
import { useAAC } from '../../context/AACContext';
import { Category } from '../../types';

const AVAILABLE_ICONS = [
  { name: 'MessageCircle', Icon: MessageCircle },
  { name: 'Heart', Icon: Heart },
  { name: 'Star', Icon: Star },
  { name: 'Smile', Icon: Smile },
  { name: 'Utensils', Icon: Utensils },
  { name: 'Home', Icon: Home },
  { name: 'Gamepad', Icon: Gamepad },
  { name: 'Music', Icon: Music },
  { name: 'Sun', Icon: Sun },
];

const COLORS = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#a855f7', '#ec4899', '#64748b'];

interface Props {
    visible: boolean;
    onClose: () => void;
    editingCategory?: Category | null;
}

export default function CreateCategoryModal({ visible, onClose, editingCategory }: Props) {
    const { addCategory, updateCategory } = useAAC();
    
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
            <View style={styles.overlay}>
                <View style={styles.modal}>
                    <View style={styles.header}>
                        <Text style={styles.title}>
                            {editingCategory ? 'Editar Categoria' : 'Nova Categoria'}
                        </Text>
                        <TouchableOpacity onPress={onClose}><X size={24} color="#64748b" /></TouchableOpacity>
                    </View>

                    <Text style={styles.label}>Nome</Text>
                    <TextInput 
                        style={styles.input} 
                        placeholder="Ex: Escola, Lazer..." 
                        value={name}
                        onChangeText={setName}
                    />

                    <Text style={styles.label}>Ícone</Text>
                    <View style={styles.row}>
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

                    <Text style={styles.label}>Cor</Text>
                    <View style={styles.row}>
                        {COLORS.map(color => (
                            <TouchableOpacity 
                                key={color} 
                                style={[styles.colorBtn, { backgroundColor: color }, selectedColor === color && styles.selectedColor]}
                                onPress={() => setSelectedColor(color)}
                            />
                        ))}
                    </View>

                    <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
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
    overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 20 },
    modal: { backgroundColor: 'white', borderRadius: 20, padding: 20, elevation: 5 },
    header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
    title: { fontSize: 20, fontWeight: 'bold', color: '#1e293b' },
    label: { fontSize: 14, fontWeight: '600', color: '#475569', marginBottom: 8, marginTop: 12 },
    input: { borderWidth: 1, borderColor: '#cbd5e1', borderRadius: 12, padding: 12, fontSize: 16 },
    row: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
    iconBtn: { padding: 10, borderRadius: 12, backgroundColor: '#f1f5f9' },
    selected: { backgroundColor: '#3b82f6' },
    colorBtn: { width: 32, height: 32, borderRadius: 16 },
    selectedColor: { borderWidth: 3, borderColor: '#1e293b' },
    saveBtn: { backgroundColor: '#2563eb', padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 24 },
    saveText: { color: 'white', fontWeight: 'bold', fontSize: 16 }
});