import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { useAAC } from '../context/AACContext';
import { Calendar, Plus, CheckCircle2, Circle, Clock, Trash2, CalendarDays, ArchiveRestore } from 'lucide-react-native';
import CreateAgendaModal from '../components/modals/CreateAgendaModal';

export default function AgendaScreen() {
    const { activeTab, agendaItems, toggleAgendaItem, deleteAgendaItem } = useAAC();
    const [showAddModal, setShowAddModal] = useState(false);
    const [viewMode, setViewMode] = useState<'active' | 'archived'>('active');

    if (activeTab !== 'agenda') return null;

    const filteredItems = useMemo(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const active: any[] = [];
        const archived: any[] = [];

        agendaItems.forEach(item => {
            const itemDate = item.date ? new Date(item.date) : new Date();
            itemDate.setHours(0, 0, 0, 0);

            // Arquivado = Já concluído OU dia já passou
            const isPast = itemDate < today;

            if (item.completed || isPast) {
                archived.push(item);
            } else {
                active.push(item);
            }
        });

        // Ordena os ativos por data mais próxima
        active.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        // Ordena os arquivados pelos mais recentes primeiro
        archived.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

        return viewMode === 'active' ? active : archived;
    }, [agendaItems, viewMode]);

    const renderItem = ({ item }: { item: any }) => {
        return (
            <View style={[styles.card, item.completed && styles.cardCompleted]}>
                <TouchableOpacity
                    style={styles.checkBtn}
                    onPress={() => toggleAgendaItem(item.id)}
                    activeOpacity={0.6}
                >
                    {item.completed ? (
                        <CheckCircle2 size={28} color="#10b981" />
                    ) : (
                        <Circle size={28} color="#cbd5e1" />
                    )}
                </TouchableOpacity>

                <View style={styles.cardInfo}>
                    <Text style={[styles.cardTitle, item.completed && styles.cardTitleCompleted]}>
                        {item.title}
                    </Text>
                    <View style={styles.cardDetails}>
                        <View style={[styles.badge, { backgroundColor: item.type === 'class' ? '#e0f2fe' : item.type === 'event' ? '#fce7f3' : '#fef3c7' }]}>
                            <Text style={[styles.badgeText, { color: item.type === 'class' ? '#0284c7' : item.type === 'event' ? '#db2777' : '#d97706' }]}>
                                {item.type === 'class' ? 'Aula' : item.type === 'event' ? 'Evento' : 'Rotina'}
                            </Text>
                        </View>
                        {item.date && (
                            <View style={styles.timeTag}>
                                <CalendarDays size={14} color="#64748b" />
                                <Text style={styles.timeText}>
                                    {new Date(item.date).toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: '2-digit' })}
                                </Text>
                            </View>
                        )}
                        {item.time && (
                            <View style={styles.timeTag}>
                                <Clock size={14} color="#64748b" />
                                <Text style={styles.timeText}>{item.time}</Text>
                            </View>
                        )}
                    </View>
                </View>

                <TouchableOpacity
                    style={styles.deleteBtn}
                    onPress={() => deleteAgendaItem(item.id)}
                >
                    <Trash2 size={20} color="#fca5a5" />
                </TouchableOpacity>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={[styles.headerIconContainer, { backgroundColor: '#e0e7ff' }]}>
                    <Calendar size={24} color="#4f46e5" />
                </View>
                <Text style={styles.title}>Minha Rotina</Text>
            </View>

            {/* View Toggle Tabs */}
            <View style={styles.tabContainer}>
                <TouchableOpacity
                    style={[styles.viewTab, viewMode === 'active' && styles.viewTabActive]}
                    onPress={() => setViewMode('active')}
                    activeOpacity={0.7}
                >
                    <Text style={[styles.viewTabText, viewMode === 'active' && styles.viewTabTextActive]}>
                        Pendente
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.viewTab, viewMode === 'archived' && styles.viewTabActive]}
                    onPress={() => setViewMode('archived')}
                    activeOpacity={0.7}
                >
                    <Text style={[styles.viewTabText, viewMode === 'archived' && styles.viewTabTextActive]}>
                        Histórico
                    </Text>
                </TouchableOpacity>
            </View>

            {filteredItems.length === 0 ? (
                <View style={styles.emptyState}>
                    {viewMode === 'active' ? (
                        <>
                            <Calendar size={48} color="#cbd5e1" />
                            <Text style={styles.emptyText}>Tudo limpo!</Text>
                            <Text style={styles.emptySubtext}>Nenhuma atividade pendente para hoje ou para os próximos dias.</Text>
                        </>
                    ) : (
                        <>
                            <ArchiveRestore size={48} color="#cbd5e1" />
                            <Text style={styles.emptyText}>Histórico vazio</Text>
                            <Text style={styles.emptySubtext}>Compromissos concluídos ou de dias passados aparecerão magicamente aqui.</Text>
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

            {/* Fab Button */}
            <TouchableOpacity
                style={styles.fab}
                activeOpacity={0.8}
                onPress={() => setShowAddModal(true)}
            >
                <Plus size={32} color="white" />
            </TouchableOpacity>

            <CreateAgendaModal
                visible={showAddModal}
                onClose={() => setShowAddModal(false)}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: 'transparent' },
    header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 16, paddingBottom: 12, backgroundColor: 'transparent', gap: 12 },
    headerIconContainer: { padding: 8, borderRadius: 12 },
    title: { fontSize: 24, fontWeight: '800', color: '#0f172a' },

    // View Tabs
    tabContainer: {
        flexDirection: 'row',
        backgroundColor: '#e2e8f0',
        marginHorizontal: 20,
        marginBottom: 10,
        borderRadius: 12,
        padding: 4
    },
    viewTab: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 8 },
    viewTabActive: { backgroundColor: 'white', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2, elevation: 2 },
    viewTabText: { fontSize: 13, fontWeight: '600', color: '#64748b' },
    viewTabTextActive: { color: '#0f172a' },

    listContent: { padding: 16, paddingBottom: 120 },

    card: {
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.03,
        shadowRadius: 8,
        elevation: 2,
        borderWidth: 1,
        borderColor: 'transparent'
    },
    cardCompleted: {
        backgroundColor: '#f8fafc',
        opacity: 0.8,
        borderColor: '#f1f5f9'
    },
    checkBtn: { padding: 4, marginRight: 12 },
    cardInfo: { flex: 1 },
    cardTitle: { fontSize: 17, fontWeight: '700', color: '#1e293b', marginBottom: 6 },
    cardTitleCompleted: { color: '#94a3b8', textDecorationLine: 'line-through' },

    cardDetails: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
    badgeText: { fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
    timeTag: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    timeText: { fontSize: 13, color: '#64748b', fontWeight: '500' },

    deleteBtn: { padding: 10, borderRadius: 12, backgroundColor: '#fef2f2', marginLeft: 12 },

    emptyState: { alignItems: 'center', justifyContent: 'center', marginTop: 100, paddingHorizontal: 40 },
    emptyText: { textAlign: 'center', color: '#64748b', marginTop: 16, fontSize: 18, fontWeight: '600' },
    emptySubtext: { textAlign: 'center', color: '#94a3b8', marginTop: 8, fontSize: 14 },

    fab: {
        position: 'absolute',
        bottom: 120, // acima da sidebar
        right: 24,
        backgroundColor: '#4f46e5',
        width: 64,
        height: 64,
        borderRadius: 32,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#4f46e5',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 6
    }
});
