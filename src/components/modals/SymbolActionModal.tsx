// src/components/modals/SymbolActionModal.tsx
import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Alert } from 'react-native';
import { Star, Edit3, Trash2, X } from 'lucide-react-native';
import { SymbolItem } from '../../types';
import { useAAC } from '../../context/AACContext';
import { useTheme } from '../../theme/useTheme';

interface Props {
    visible: boolean;
    onClose: () => void;
    item: SymbolItem | null;
    categoryId: string | null;
    onEdit: (item: SymbolItem) => void;
}

export default function SymbolActionModal({ visible, onClose, item, categoryId, onEdit }: Props) {
    const { deleteSymbolFromCategory, favorites, addFavorite, removeFavorite } = useAAC();
    const { colors, isDark } = useTheme();

    if (!item) return null;

    const isFavorite = favorites.some(f => f.id == item.id);

    const handleToggleFavorite = () => {
        if (isFavorite) {
            removeFavorite(item.id);
        } else {
            addFavorite(item);
        }
        onClose();
    }

    const handleEdit = () => {
        onClose();
        onEdit(item);
    };

    const handleDelete = () => {
        Alert.alert(
            "Excluir Símbolo",
            `Tem certeza que deseja apagar "${item.label}"?`,
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Excluir",
                    style: "destructive",
                    onPress: () => {
                        if (categoryId) deleteSymbolFromCategory(categoryId, item.id);
                        onClose();
                    }
                }
            ]
        );
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
        >
            <TouchableOpacity style={[styles.overlay, { backgroundColor: colors.overlay }]} activeOpacity={1} onPress={onClose}>
                <View style={[styles.modalContent, { backgroundColor: colors.background, shadowColor: colors.cardShadow }]} onStartShouldSetResponder={() => true}>
                    <View style={[styles.header, { borderBottomColor: colors.border }]}>
                        <Text style={[styles.title, { color: colors.text }]}>Opções de Símbolo</Text>
                        <TouchableOpacity onPress={onClose} style={[styles.closeBtn, { backgroundColor: isDark ? colors.border : '#e2e8f0', borderColor: isDark ? colors.textMuted : '#cbd5e1' }]}>
                            <X size={20} color={colors.textSecondary} />
                        </TouchableOpacity>
                    </View>

                    <View style={[styles.itemPreview, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
                        <Text style={[styles.previewName, { color: colors.textSecondary }]}>{item.label}</Text>
                    </View>

                    <View style={styles.optionsContainer}>
                        {/* Botão de Favorito (Toggle) */}
                        <TouchableOpacity style={[styles.optionBtn, { backgroundColor: colors.card, borderColor: colors.border }]} onPress={handleToggleFavorite}>
                            <View style={[styles.iconBg, { backgroundColor: colors.warningBackground }]}>
                                <Star size={24} color={colors.warning} fill={isFavorite ? colors.warning : "transparent"} />
                            </View>
                            <View style={styles.optionLabels}>
                                <Text style={[styles.optionTitle, { color: colors.text }]}>{isFavorite ? 'Remover dos Favoritos' : 'Adicionar aos Favoritos'}</Text>
                                <Text style={[styles.optionDesc, { color: colors.textSecondary }]}>Acesso rápido pela aba de Estrela.</Text>
                            </View>
                        </TouchableOpacity>

                        {categoryId && categoryId !== 'core' && (
                            <>
                                <TouchableOpacity style={[styles.optionBtn, { backgroundColor: colors.card, borderColor: colors.border }]} onPress={handleEdit}>
                                    <View style={[styles.iconBg, { backgroundColor: colors.primaryBackground }]}>
                                        <Edit3 size={24} color={colors.primary} />
                                    </View>
                                    <View style={styles.optionLabels}>
                                        <Text style={[styles.optionTitle, { color: colors.text }]}>Editar Símbolo</Text>
                                        <Text style={[styles.optionDesc, { color: colors.textSecondary }]}>Modifique o texto, cor ou o desenho do botão.</Text>
                                    </View>
                                </TouchableOpacity>

                                <TouchableOpacity style={[styles.optionBtnRed, { backgroundColor: isDark ? colors.border : '#fff1f2', borderColor: isDark ? colors.dangerBackground : '#ffe4e6' }]} onPress={handleDelete}>
                                    <View style={[styles.iconBg, { backgroundColor: colors.dangerBackground }]}>
                                        <Trash2 size={24} color={colors.danger} />
                                    </View>
                                    <View style={styles.optionLabels}>
                                        <Text style={[styles.optionTitle, { color: colors.danger }]}>Excluir Definitivamente</Text>
                                        <Text style={[styles.optionDesc, { color: colors.textSecondary }]}>Apaga o card atual da sua categoria.</Text>
                                    </View>
                                </TouchableOpacity>
                            </>
                        )}
                    </View>

                </View>
            </TouchableOpacity>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: { flex: 1, justifyContent: 'flex-end' },
    modalContent: { borderTopLeftRadius: 32, borderTopRightRadius: 32, paddingBottom: 40, shadowOffset: { width: 0, height: -10 }, shadowOpacity: 0.1, shadowRadius: 20, elevation: 20 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 24, borderBottomWidth: 1 },
    title: { fontSize: 20, fontWeight: '800' },
    closeBtn: { padding: 8, borderRadius: 20, borderWidth: 1 },
    itemPreview: { padding: 20, alignItems: 'center', borderBottomWidth: 1 },
    previewName: { fontSize: 18, fontWeight: '700' },
    optionsContainer: { padding: 20, gap: 12 },
    optionBtn: { flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 20, borderWidth: 1 },
    optionBtnRed: { flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 20, borderWidth: 1 },
    iconBg: { padding: 12, borderRadius: 16, marginRight: 16 },
    optionLabels: { flex: 1 },
    optionTitle: { fontSize: 16, fontWeight: '700' },
    optionDesc: { fontSize: 12, marginTop: 2 }
});