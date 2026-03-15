// src/components/screens/AgendaView.tsx

import React, { useState, useMemo } from 'react';
import Page from '../layout/Page';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { useAAC } from '../../context/AACContext';
import SegmentedControl from '@react-native-segmented-control/segmented-control';
import { Calendar, Plus, CheckCircle2, Circle, Clock, Trash2, CalendarDays, ArchiveRestore } from 'lucide-react-native';
import CreateAgendaModal from '../modals/CreateAgendaModal';
import { useTheme } from '../../theme/useTheme';

export default function Agenda() {
    const { agendaItems, toggleAgendaItem, deleteAgendaItem } = useAAC();
    const [showAddModal, setShowAddModal] = useState(false);
    const [viewMode, setViewMode] = useState<'active' | 'archived'>('active');
    const { colors, isDark } = useTheme();

    const filteredItems = useMemo(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const active: any[] = [];
        const archived: any[] = [];

        agendaItems.forEach(item => {
            const itemDate = item.date ? new Date(item.date) : new Date();
            itemDate.setHours(0, 0, 0, 0);

            const isPast = itemDate < today;

            if (item.completed || isPast) {
                archived.push(item);
            } else {
                active.push(item);
            }
        });

        active.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        archived.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

        return viewMode === 'active' ? active : archived;
    }, [agendaItems, viewMode]);

    const renderItem = ({ item }: { item: any }) => {
        return (
            <View style={[styles.card, { backgroundColor: colors.card, shadowColor: colors.cardShadow }, item.completed && { backgroundColor: isDark ? colors.background : '#f8fafc', borderColor: colors.transparentSeparator, opacity: 0.8 }]}>
                <TouchableOpacity style={styles.checkBtn} onPress={() => toggleAgendaItem(item.id)} activeOpacity={0.6}>
                    {item.completed ? <CheckCircle2 size={28} color={colors.success} /> : <CheckCircle2 size={28} color={colors.textMuted} />}
                </TouchableOpacity>

                <View style={styles.cardInfo}>
                    <Text style={[styles.cardTitle, { color: colors.text }, item.completed && { color: colors.textMuted, textDecorationLine: 'line-through' }]}>{item.title}</Text>
                    <View style={styles.cardDetails}>
                        <View style={[styles.badge, { backgroundColor: item.type === 'class' ? colors.primaryBackground : item.type === 'event' ? '#fce7f3' : colors.warningBackground }]}>
                            <Text style={[styles.badgeText, { color: item.type === 'class' ? colors.primary : item.type === 'event' ? '#db2777' : colors.warning }]}>
                                {item.type === 'class' ? 'Aula' : item.type === 'event' ? 'Evento' : 'Rotina'}
                            </Text>
                        </View>
                        {item.date && (
                            <View style={styles.timeTag}>
                                <CalendarDays size={14} color={colors.textSecondary} />
                                <Text style={[styles.timeText, { color: colors.textSecondary }]}>
                                    {new Date(item.date).toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: '2-digit' })}
                                </Text>
                            </View>
                        )}
                        {item.time && (
                            <View style={styles.timeTag}>
                                <Clock size={14} color={colors.textSecondary} />
                                <Text style={[styles.timeText, { color: colors.textSecondary }]}>{item.time}</Text>
                            </View>
                        )}
                    </View>
                </View>

                <TouchableOpacity style={[styles.deleteBtn, { backgroundColor: colors.dangerBackground }]} onPress={() => deleteAgendaItem(item.id)}>
                    <Trash2 size={20} color={colors.danger} />
                </TouchableOpacity>
            </View>
        );
    };

    return (
        <Page>
            <View style={styles.header}>
                <View style={[styles.headerIconContainer, { backgroundColor: colors.primaryBackground }]}><Calendar size={24} color={colors.primary} /></View>
                <Text style={[styles.title, { color: colors.text }]}>Minha Rotina</Text>
            </View>

            <View style={styles.segmentedContainer}>
                <SegmentedControl
                    values={['Pendente', 'Histórico']}
                    selectedIndex={viewMode === 'active' ? 0 : 1}
                    onChange={(event) => {
                        const index = event.nativeEvent.selectedSegmentIndex;
                        setViewMode(index === 0 ? 'active' : 'archived');
                    }}
                    appearance={isDark ? "dark" : "light"}
                    style={{ height: 48 }}
                    fontStyle={{ color: colors.textSecondary, fontSize: 16 }}
                    activeFontStyle={{ color: colors.text, fontWeight: 'bold', fontSize: 16 }}
                />
            </View>

            {filteredItems.length === 0 ? (
                <View style={styles.emptyState}>
                    {viewMode === 'active' ? (
                        <>
                            <Calendar size={48} color={colors.textMuted} />
                            <Text style={[styles.emptyText, { color: colors.text }]}>Tudo limpo!</Text>
                            <Text style={[styles.emptySubtext, { color: colors.textMuted }]}>Nenhuma atividade pendente para hoje ou para os próximos dias.</Text>
                        </>
                    ) : (
                        <>
                            <ArchiveRestore size={48} color={colors.textMuted} />
                            <Text style={[styles.emptyText, { color: colors.text }]}>Histórico vazio</Text>
                            <Text style={[styles.emptySubtext, { color: colors.textMuted }]}>Compromissos concluídos ou de dias passados aparecerão magicamente aqui.</Text>
                        </>
                    )}
                </View>
            ) : (
                <FlatList
                    data={filteredItems}
                    keyExtractor={(item) => item.id}
                    renderItem={renderItem}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.listContent}
                />
            )}

            <TouchableOpacity style={[styles.fab, { backgroundColor: colors.primary, shadowColor: colors.primary }]} activeOpacity={0.8} onPress={() => setShowAddModal(true)}>
                <Plus size={32} color="white" />
            </TouchableOpacity>

            <CreateAgendaModal visible={showAddModal} onClose={() => setShowAddModal(false)} />
        </Page>
    );
}

const styles = StyleSheet.create({
    header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 16, paddingBottom: 12, gap: 12 },
    headerIconContainer: { padding: 8, borderRadius: 12 },
    title: { fontSize: 24, fontWeight: '800' },
    listContent: { padding: 16, paddingBottom: 120 },
    card: { borderRadius: 20, padding: 16, flexDirection: 'row', alignItems: 'center', marginBottom: 12, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.03, shadowRadius: 8, elevation: 2, borderWidth: 1, borderColor: 'transparent' },
    checkBtn: { padding: 4, marginRight: 12 },
    cardInfo: { flex: 1 },
    cardTitle: { fontSize: 17, fontWeight: '700', marginBottom: 6 },
    cardDetails: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
    badgeText: { fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
    timeTag: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    timeText: { fontSize: 13, fontWeight: '500' },
    deleteBtn: { padding: 10, borderRadius: 12, marginLeft: 12 },
    emptyState: { alignItems: 'center', justifyContent: 'center', marginTop: 100, paddingHorizontal: 40 },
    emptyText: { textAlign: 'center', marginTop: 16, fontSize: 18, fontWeight: '600' },
    emptySubtext: { textAlign: 'center', marginTop: 8, fontSize: 14 },
    fab: { position: 'absolute', bottom: 100, right: 24, width: 64, height: 64, borderRadius: 32, alignItems: 'center', justifyContent: 'center', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 12, elevation: 6 },
    segmentedContainer: {
        paddingHorizontal: 20,
        marginBottom: 15,
    },
});