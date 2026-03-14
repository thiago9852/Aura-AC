// src/components/modals/CreateAgendaModal.tsx
import React, { useState } from 'react';
import { View, Text, Modal, TextInput, TouchableOpacity, StyleSheet, ScrollView, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useAAC } from '../../context/AACContext';
import { X, Clock, BookOpen, CalendarHeart, CheckSquare, Calendar as CalendarIcon } from 'lucide-react-native';

interface Props {
    visible: boolean;
    onClose: () => void;
}

export default function CreateAgendaModal({ visible, onClose }: Props) {
    const { addAgendaItem } = useAAC();
    
    const [title, setTitle] = useState('');
    const [type, setType] = useState<'event' | 'class' | 'task'>('task');
    
    // Estados de Data e Hora
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedTime, setSelectedTime] = useState(new Date());
    const [isTimeSet, setIsTimeSet] = useState(false);
    
    // Controles de visibilidade dos seletores
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);

    const handleSave = () => {
        if (!title.trim()) return;
        
        let timeString = undefined;
        if (isTimeSet) {
            const hours = selectedTime.getHours().toString().padStart(2, '0');
            const minutes = selectedTime.getMinutes().toString().padStart(2, '0');
            timeString = `${hours}:${minutes}`;
        }

        addAgendaItem({ title, type, time: timeString, date: selectedDate.toISOString() });
        
        // Resetar estados e fechar
        setTitle(''); 
        setType('task'); 
        setIsTimeSet(false);
        setSelectedDate(new Date());
        setSelectedTime(new Date());
        onClose();
    };

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
    };

    const formatTime = (date: Date) => {
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
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
                            placeholder="Ex: Aula de Inglês" 
                            placeholderTextColor={'#64748b'}
                            value={title} 
                            onChangeText={setTitle} 
                        />

                        {/* Seletor de data */}
                        <Text style={styles.label}>Para qual dia?</Text>
                        <View style={styles.rowInput}>
                            <View style={styles.iconBg}><CalendarIcon size={20} color="#64748b" /></View>
                            <TouchableOpacity
                                style={[styles.input, { flex: 1, marginBottom: 0, justifyContent: 'center' }]}
                                onPress={() => setShowDatePicker(true)}
                            >
                                <Text style={styles.inputText}>{formatDate(selectedDate)}</Text>
                            </TouchableOpacity>
                        </View>

                        {showDatePicker && (
                            <View style={styles.pickerWrapper}>
                                <DateTimePicker
                                    value={selectedDate}
                                    mode="date"
                                    locale="pt-BR"
                                    textColor="#0f172a"
                                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                                    onChange={(event, date) => {
                                        if (Platform.OS === 'android') setShowDatePicker(false);
                                        if (date) setSelectedDate(date);
                                    }}
                                />
                                {Platform.OS === 'ios' && (
                                    <TouchableOpacity style={styles.confirmBtn} onPress={() => setShowDatePicker(false)}>
                                        <Text style={styles.confirmBtnText}>Confirmar Data</Text>
                                    </TouchableOpacity>
                                )}
                            </View>
                        )}

                        {/* Seletor de hora */}
                        <Text style={styles.label}>Horário (Opcional)</Text>
                        <View style={styles.rowInput}>
                            <View style={styles.iconBg}><Clock size={20} color="#64748b" /></View>
                            <TouchableOpacity
                                style={[styles.input, { flex: 1, marginBottom: 0, justifyContent: 'center' }]}
                                onPress={() => setShowTimePicker(true)}
                            >
                                <Text style={[styles.inputText, !isTimeSet && { color: '#94a3b8' }]}>
                                    {isTimeSet ? formatTime(selectedTime) : "Selecionar horário"}
                                </Text>
                            </TouchableOpacity>
                        </View>

                        {showTimePicker && (
                            <View style={styles.pickerWrapper}>
                                <DateTimePicker
                                    value={selectedTime}
                                    mode="time"
                                    textColor="#0f172a"
                                    is24Hour={true}
                                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                                    onChange={(event, date) => {
                                        if (Platform.OS === 'android') setShowTimePicker(false);
                                        if (date) {
                                            setSelectedTime(date);
                                            setIsTimeSet(true);
                                        }
                                    }}
                                />
                                {Platform.OS === 'ios' && (
                                    <TouchableOpacity style={styles.confirmBtn} onPress={() => setShowTimePicker(false)}>
                                        <Text style={styles.confirmBtnText}>Confirmar Hora</Text>
                                    </TouchableOpacity>
                                )}
                            </View>
                        )}

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
                                <Text style={[styles.tabText, type === 'event' && styles.activeTabTextEvent]}>Terapia</Text>
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
    input: { backgroundColor: 'white', borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 16, padding: 16 },
    inputText: { fontSize: 16, color: '#1e293b' },
    
    rowInput: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    iconBg: { padding: 16, backgroundColor: 'white', borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 16 },
    
    pickerWrapper: { backgroundColor: '#f1f5f9', borderRadius: 16, marginTop: 12, padding: 12, alignItems: 'center' },
    confirmBtn: { backgroundColor: '#3b82f6', paddingHorizontal: 20, paddingVertical: 12, borderRadius: 12, marginTop: 8, width: '100%', alignItems: 'center' },
    confirmBtnText: { color: 'white', fontWeight: 'bold' },

    tabs: { flexDirection: 'row', gap: 8, marginTop: 8 },
    tab: { flex: 1, paddingVertical: 14, alignItems: 'center', borderRadius: 16, backgroundColor: 'white', borderWidth: 1, borderColor: '#e2e8f0', gap: 4 },
    tabText: { fontWeight: '600', color: '#64748b', fontSize: 12 },
    
    activeTabTask: { backgroundColor: '#fef3c7', borderColor: '#fde68a' }, 
    activeTabTextTask: { color: '#d97706' },
    activeTabClass: { backgroundColor: '#e0f2fe', borderColor: '#bae6fd' }, 
    activeTabTextClass: { color: '#0284c7' },
    activeTabEvent: { backgroundColor: '#fce7f3', borderColor: '#fbcfe8' }, 
    activeTabTextEvent: { color: '#db2777' },
    
    saveBtn: { backgroundColor: '#4f46e5', padding: 18, borderRadius: 16, alignItems: 'center', marginTop: 32 },
    saveText: { color: 'white', fontWeight: 'bold', fontSize: 16 }
});