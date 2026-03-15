// src/components/screens/ManageView.tsx
import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useAAC } from '../../context/AACContext';
import CreateCategoryModal from '../../components/modals/CreateCategoryModal';
import { Category } from '../../types';
import Page from '../layout/Page';

import {
    FolderCog, Plus, Trash2, Pencil, LayoutGrid,
    MessageCircle, Heart, Star, Smile, Utensils, Home,
    Gamepad, Music, Sun, Book, Briefcase, ShoppingBag,
    X, Dumbbell, Hospital, BookMarked, Laptop, PenTool, Coffee, ShoppingCart,
    Calendar, Bell, Plane, MapPin, Globe, Bus, Film, Users
} from 'lucide-react-native';
import { useTheme } from '../../theme/useTheme';

const ICON_MAP: any = {
    MessageCircle, Heart, Star, Smile, Utensils, Home,
    Gamepad, Music, Sun, Book, Briefcase, ShoppingBag, LayoutGrid,
    Dumbbell, Hospital, BookMarked, Laptop, PenTool, Coffee, ShoppingCart,
    Calendar, Bell, Plane, MapPin, Globe, Bus, Film, Users
};

export default function Manage() {
    const { categories, deleteCategory } = useAAC();
    const [showModal, setShowModal] = useState(false);
    const { colors, isDark } = useTheme();

    const [editingCategory, setEditingCategory] = useState<Category | null>(null);

    const handleDelete = (id: string, name: string) => {
        Alert.alert(
            "Excluir",
            `Apagar a categoria "${name}"?`,
            [
                { text: "Cancelar", style: "cancel" },
                { text: "Apagar", style: "destructive", onPress: () => deleteCategory(id) }
            ]
        );
    };

    const handleEdit = (category: Category) => {
        setEditingCategory(category);
        setShowModal(true);
    };

    const handleCreate = () => {
        setEditingCategory(null);
        setShowModal(true);
    };

    return (
        <Page>
            <View style={styles.header}>
                <View style={[styles.headerIconContainer, { backgroundColor: colors.primaryBackground }]}><FolderCog size={24} color={colors.primary} /></View>
                <Text style={[styles.title, { color: colors.text }]}>Categorias</Text>
            </View>

            <FlatList
                data={categories}
                keyExtractor={item => item.id}
                contentContainerStyle={{ padding: 16, gap: 12, paddingBottom: 120 }}
                renderItem={({ item }) => {
                    const IconComponent = ICON_MAP[item.icon] || LayoutGrid;
                    const catColor = item.color.startsWith('#') ? item.color : colors.primary;

                    return (
                        <View style={[styles.item, { backgroundColor: colors.card, shadowColor: colors.cardShadow }]}>
                            <View style={[styles.iconBox, { backgroundColor: isDark ? `${catColor}30` : catColor + '20' }]}>
                                <IconComponent size={24} color={catColor} />
                            </View>
                            <View style={styles.info}>
                                <Text style={[styles.itemName, { color: colors.text }]}>{item.name}</Text>
                                <Text style={[styles.itemMeta, { color: colors.textSecondary }]}>{item.items.length} itens</Text>
                            </View>
                            <View style={styles.actions}>
                                {item.id !== 'core' && (
                                    <>
                                        <TouchableOpacity
                                            onPress={() => handleEdit(item)}
                                            style={[styles.actionBtn, { backgroundColor: colors.primaryBackground }]}
                                        >
                                            <Pencil size={20} color={colors.primary} />
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            onPress={() => handleDelete(item.id, item.name)}
                                            style={[styles.actionBtn, { backgroundColor: colors.dangerBackground }]}
                                        >
                                            <Trash2 size={20} color={colors.danger} />
                                        </TouchableOpacity>
                                    </>
                                )}
                            </View>
                        </View>
                    );
                }}
            />

            <CreateCategoryModal
                visible={showModal}
                onClose={() => setShowModal(false)}
                editingCategory={editingCategory}
            />

            <TouchableOpacity
                style={[styles.fab, { backgroundColor: colors.primary, shadowColor: colors.primary }]}
                onPress={handleCreate}
                activeOpacity={0.8}
            >
                <Plus size={32} color="white" />
            </TouchableOpacity>
        </Page>
    );
}

const styles = StyleSheet.create({
    header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 16, paddingBottom: 12, backgroundColor: 'transparent', gap: 12 },
    headerIconContainer: { padding: 8, borderRadius: 12 },
    title: { fontSize: 24, fontWeight: '800' },
    item: { flexDirection: 'row', alignItems: 'center', padding: 12, borderRadius: 12, elevation: 1, gap: 12 },
    iconBox: { width: 48, height: 48, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
    info: { flex: 1 },
    itemName: { fontSize: 16, fontWeight: 'bold' },
    itemMeta: { fontSize: 12, marginTop: 2 },
    actions: { flexDirection: 'row', gap: 8 },
    actionBtn: { padding: 10, borderRadius: 8 },
    fab: {
        position: 'absolute',
        bottom: 100,
        right: 24,
        width: 64,
        height: 64,
        borderRadius: 32,
        alignItems: 'center',
        justifyContent: 'center',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
        elevation: 10
    }
});