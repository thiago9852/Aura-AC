import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Alert } from 'react-native';
import { Star, Edit3, Trash2, X } from 'lucide-react-native';
import { SymbolItem } from '../../types';
import { useAAC } from '../../context/AACContext';

interface Props {
    visible: boolean;
    onClose: () => void;
    item: SymbolItem | null;
    categoryId: string | null;
    onEdit: (item: SymbolItem) => void;
}

export default function SymbolActionModal({ visible, onClose, item, categoryId, onEdit }: Props) {
    const { deleteSymbolFromCategory, favorites, addFavorite, removeFavorite } = useAAC();

    if (!item) return null;

    const isFavorite = favorites.some(f => f.id === item.id);

    const handleToggleFavorite = () => {
        if (isFavorite) {
            removeFavorite(item.id);
        } else {
            addFavorite(item);
        }
        onClose();
    };

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
            <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose}>
                <View style={styles.modalContent} onStartShouldSetResponder={() => true}>
                    <View style={styles.header}>
                        <Text style={styles.title}>Opções de Símbolo</Text>
                        <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                            <X size={24} color="#64748b" />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.itemPreview}>
                        <Text style={styles.previewName}>{item.label}</Text>
                    </View>

                    <View style={styles.optionsContainer}>
                        <TouchableOpacity style={styles.optionBtn} onPress={handleToggleFavorite}>
                            <View style={[styles.iconBg, { backgroundColor: '#fef9c3' }]}>
                                <Star size={24} color="#eab308" fill={isFavorite ? "#eab308" : "transparent"} />
                            </View>
                            <View style={styles.optionLabels}>
                                <Text style={styles.optionTitle}>{isFavorite ? 'Remover dos Favoritos' : 'Adicionar aos Favoritos'}</Text>
                                <Text style={styles.optionDesc}>Correio rápido de acesso pela aba de Coração.</Text>
                            </View>
                        </TouchableOpacity>

                        {categoryId && (
                            <>
                                <TouchableOpacity style={styles.optionBtn} onPress={handleEdit}>
                                    <View style={[styles.iconBg, { backgroundColor: '#e0f2fe' }]}>
                                        <Edit3 size={24} color="#0284c7" />
                                    </View>
                                    <View style={styles.optionLabels}>
                                        <Text style={styles.optionTitle}>Editar Símbolo</Text>
                                        <Text style={styles.optionDesc}>Modifique o texto, cor ou o desenho do botão.</Text>
                                    </View>
                                </TouchableOpacity>

                                <TouchableOpacity style={styles.optionBtnRed} onPress={handleDelete}>
                                    <View style={[styles.iconBg, { backgroundColor: '#fee2e2' }]}>
                                        <Trash2 size={24} color="#dc2626" />
                                    </View>
                                    <View style={styles.optionLabels}>
                                        <Text style={[styles.optionTitle, { color: '#dc2626' }]}>Excluir Definitivamente</Text>
                                        <Text style={styles.optionDesc}>Apaga o card atual da sua categoria.</Text>
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
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(15, 23, 42, 0.4)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#ffffff',
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        paddingBottom: 40,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 24,
        borderBottomWidth: 1,
        borderBottomColor: '#f8fafc',
    },
    title: { fontSize: 20, fontWeight: '800', color: '#0f172a' },
    closeBtn: { padding: 8, backgroundColor: '#f1f5f9', borderRadius: 99 },

    itemPreview: {
        padding: 20,
        backgroundColor: '#f8fafc',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#f1f5f9'
    },
    previewName: { fontSize: 18, fontWeight: '700', color: '#475569' },

    optionsContainer: { padding: 20, gap: 12 },
    optionBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#f8fafc',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#f1f5f9'
    },
    optionBtnRed: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#fff1f2',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#ffe4e6'
    },
    iconBg: { padding: 12, borderRadius: 16, marginRight: 16 },
    optionLabels: { flex: 1 },
    optionTitle: { fontSize: 16, fontWeight: '700', color: '#1e293b' },
    optionDesc: { fontSize: 12, color: '#64748b', marginTop: 2 }
});
