import React, { useState } from 'react';
import { View, Text, Modal, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useAAC } from '../../context/AACContext';
import { X, Clock, BookOpen, CalendarHeart, CheckSquare, CalendarDays } from 'lucide-react-native';

// Auxiliares de Data
const getDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i <= 6; i++) { // Hoje + próximos 6 dias
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        dates.push(date);
    }
    return dates;
};

const formatDayName = (date: Date) => {
    const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    return days[date.getDay()];
};

const isSameDay = (d1: Date, d2: Date) => {
    return d1.getFullYear() === d2.getFullYear() &&
        d1.getMonth() === d2.getMonth() &&
        d1.getDate() === d2.getDate();
};

interface Props {
    visible: boolean;
    onClose: () => void;
}

export default function CreateAgendaModal({ visible, onClose }: Props) {
    const { addAgendaItem } = useAAC();

    const [title, setTitle] = useState('');
    const [type, setType] = useState<'event' | 'class' | 'task'>('task');
    const [time, setTime] = useState('');
    const [selectedDate, setSelectedDate] = useState(new Date());

    const dates = React.useMemo(() => getDates(), []);

    const handleSave = () => {
        if (!title.trim()) return;

        addAgendaItem({
            title,
            type,
            time: time || undefined,
            date: selectedDate.toISOString()
        });

        // Limpa e fecha
        setTitle('');
        setType('task');
        setTime('');
        setSelectedDate(new Date());
        onClose();
    };

    return (
        <Modal visible={visible} animationType="slide" transparent>
            <View style={styles.overlay}>
                <View style={styles.modal}>
                    <View style={styles.header}>
                        <Text style={styles.title}>Novo Compromisso</Text>
                        <TouchableOpacity onPress={onClose}><X size={24} color="#64748b" /></TouchableOpacity>
                    </View>

                    <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                        <Text style={styles.label}>O que você vai fazer?</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Ex: Terapia Ocupacional"
                            value={title}
                            onChangeText={setTitle}
                        />

                        {/* Seletor de Data */}
                        <Text style={styles.label}>Para qual dia?</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.dateScroll}>
                            {dates.map((date, idx) => {
                                const isActive = isSameDay(date, selectedDate);
                                const isToday = isSameDay(date, new Date());

                                const tomorrow = new Date();
                                tomorrow.setDate(tomorrow.getDate() + 1);
                                const isTomorrow = isSameDay(date, tomorrow);

                                return (
                                    <TouchableOpacity
                                        key={idx}
                                        style={[styles.dateCard, isActive && styles.dateCardActive]}
                                        onPress={() => setSelectedDate(date)}
                                        activeOpacity={0.7}
                                    >
                                        <Text style={[styles.dateDayName, isActive && styles.dateTextActive]}>
                                            {isToday ? 'Hoje' : isTomorrow ? 'Amanhã' : formatDayName(date)}
                                        </Text>
                                        <Text style={[styles.dateNumber, isActive && styles.dateTextActive]}>
                                            {date.getDate()}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </ScrollView>

                        <Text style={styles.label}>Horário (Opcional)</Text>
                        <View style={styles.timeRow}>
                            <View style={styles.iconBg}><Clock size={20} color="#64748b" /></View>
                            <TextInput
                                style={[styles.input, { flex: 1, marginBottom: 0 }]}
                                placeholder="14:30"
                                value={time}
                                onChangeText={setTime}
                            />
                        </View>

                        <Text style={styles.label}>Categoria da Atividade</Text>
                        <View style={styles.tabs}>
                            <TouchableOpacity style={[styles.tab, type === 'task' && styles.activeTabTask]} onPress={() => setType('task')}>
                                <CheckSquare size={20} color={type === 'task' ? '#d97706' : '#94a3b8'} />
                                <Text style={[styles.tabText, type === 'task' && styles.activeTabTextTask]}>Rotina</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.tab, type === 'class' && styles.activeTabClass]} onPress={() => setType('class')}>
                                <BookOpen size={20} color={type === 'class' ? '#0284c7' : '#94a3b8'} />
                                <Text style={[styles.tabText, type === 'class' && styles.activeTabTextClass]}>Aula</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.tab, type === 'event' && styles.activeTabEvent]} onPress={() => setType('event')}>
                                <CalendarHeart size={20} color={type === 'event' ? '#db2777' : '#94a3b8'} />
                                <Text style={[styles.tabText, type === 'event' && styles.activeTabTextEvent]}>Terapia/Evento</Text>
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
                            <Text style={styles.saveText}>Adicionar à Agenda</Text>
                        </TouchableOpacity>
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: { flex: 1, backgroundColor: 'rgba(15, 23, 42, 0.5)', justifyContent: 'flex-end' },
    modal: { backgroundColor: '#f8fafc', borderTopLeftRadius: 32, borderTopRightRadius: 32, padding: 24, paddingBottom: 40, elevation: 20 },
    header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20, alignItems: 'center' },
    title: { fontSize: 22, fontWeight: '800', color: '#0f172a' },
    scrollContent: { paddingBottom: 20 },

    label: { fontSize: 14, fontWeight: '700', color: '#475569', marginBottom: 8, marginTop: 16 },
    input: { backgroundColor: 'white', borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 16, padding: 16, fontSize: 16, color: '#1e293b' },

    timeRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    iconBg: { padding: 16, backgroundColor: 'white', borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 16 },

    tabs: { flexDirection: 'row', gap: 8 },
    tab: { flex: 1, paddingVertical: 14, alignItems: 'center', borderRadius: 16, backgroundColor: 'white', borderWidth: 1, borderColor: '#e2e8f0', gap: 4 },
    tabText: { fontWeight: '600', color: '#64748b', fontSize: 12 },

    activeTabTask: { backgroundColor: '#fef3c7', borderColor: '#fde68a' },
    activeTabTextTask: { color: '#d97706' },
    activeTabClass: { backgroundColor: '#e0f2fe', borderColor: '#bae6fd' },
    activeTabTextClass: { color: '#0284c7' },
    activeTabEvent: { backgroundColor: '#fce7f3', borderColor: '#fbcfe8' },
    activeTabTextEvent: { color: '#db2777' },

    // Date Picker
    dateScroll: { gap: 10, paddingBottom: 4 },
    dateCard: {
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 16,
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: '#e2e8f0',
        alignItems: 'center',
        minWidth: 70
    },
    dateCardActive: {
        backgroundColor: '#4f46e5',
        borderColor: '#4f46e5',
    },
    dateDayName: { fontSize: 13, color: '#64748b', fontWeight: '600', marginBottom: 2 },
    dateNumber: { fontSize: 18, color: '#1e293b', fontWeight: '800' },
    dateTextActive: { color: 'white' },

    saveBtn: { backgroundColor: '#4f46e5', padding: 18, borderRadius: 16, alignItems: 'center', marginTop: 32 },
    saveText: { color: 'white', fontWeight: 'bold', fontSize: 16 }
});
