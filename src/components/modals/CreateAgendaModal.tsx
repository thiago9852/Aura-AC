// src/components/modals/CreateAgendaModal.tsx
import React, { useState } from 'react';
import { View, Text, Modal, TextInput, TouchableOpacity, StyleSheet, ScrollView, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useAAC } from '../../context/AACContext';
import { X, Clock, BookOpen, CalendarHeart, CheckSquare, Calendar as CalendarIcon } from 'lucide-react-native';
import { useTheme } from '../../theme/useTheme';

interface Props {
    visible: boolean;
    onClose: () => void;
}

export default function CreateAgendaModal({ visible, onClose }: Props) {
    const { addAgendaItem } = useAAC();
    const { colors, isDark } = useTheme();
    
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
            <View style={[styles.overlay, { backgroundColor: colors.overlay }]}>
                <View style={[styles.modal, { backgroundColor: colors.background }]}>
                    <View style={styles.header}>
                        <Text style={[styles.title, { color: colors.text }]}>Novo Compromisso</Text>
                        <TouchableOpacity onPress={onClose} style={[styles.closeBtn, { backgroundColor: isDark ? colors.border : '#e2e8f0', borderColor: isDark ? colors.textMuted : '#cbd5e1' }]}>
                            <X size={20} color={colors.textSecondary} />
                        </TouchableOpacity>
                    </View>

                    <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                        
                        <Text style={[styles.label, { color: colors.textSecondary }]}>O que você vai fazer?</Text>
                        <TextInput 
                            style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.text }]} 
                            placeholder="Ex: Aula de Inglês" 
                            placeholderTextColor={colors.textMuted}
                            value={title} 
                            onChangeText={setTitle} 
                        />

                        {/* Seletor de data */}
                        <Text style={[styles.label, { color: colors.textSecondary }]}>Para qual dia?</Text>
                        <View style={styles.rowInput}>
                            <View style={[styles.iconBg, { backgroundColor: colors.card, borderColor: colors.border }]}><CalendarIcon size={20} color={colors.textSecondary} /></View>
                            <TouchableOpacity
                                style={[styles.input, { flex: 1, marginBottom: 0, justifyContent: 'center', backgroundColor: colors.card, borderColor: colors.border }]}
                                onPress={() => setShowDatePicker(true)}
                            >
                                <Text style={[styles.inputText, { color: colors.text }]}>{formatDate(selectedDate)}</Text>
                            </TouchableOpacity>
                        </View>

                        {showDatePicker && (
                            <View style={[styles.pickerWrapper, { backgroundColor: isDark ? colors.border : '#f1f5f9' }]}>
                                <DateTimePicker
                                    value={selectedDate}
                                    mode="date"
                                    locale="pt-BR"
                                    textColor={colors.text}
                                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                                    onChange={(event, date) => {
                                        if (Platform.OS === 'android') setShowDatePicker(false);
                                        if (date) setSelectedDate(date);
                                    }}
                                />
                                {Platform.OS === 'ios' && (
                                    <TouchableOpacity style={[styles.confirmBtn, { backgroundColor: colors.primary }]} onPress={() => setShowDatePicker(false)}>
                                        <Text style={styles.confirmBtnText}>Confirmar Data</Text>
                                    </TouchableOpacity>
                                )}
                            </View>
                        )}

                        {/* Seletor de hora */}
                        <Text style={[styles.label, { color: colors.textSecondary }]}>Horário (Opcional)</Text>
                        <View style={styles.rowInput}>
                            <View style={[styles.iconBg, { backgroundColor: colors.card, borderColor: colors.border }]}><Clock size={20} color={colors.textSecondary} /></View>
                            <TouchableOpacity
                                style={[styles.input, { flex: 1, marginBottom: 0, justifyContent: 'center', backgroundColor: colors.card, borderColor: colors.border }]}
                                onPress={() => setShowTimePicker(true)}
                            >
                                <Text style={[styles.inputText, { color: colors.text }, !isTimeSet && { color: colors.textMuted }]}>
                                    {isTimeSet ? formatTime(selectedTime) : "Selecionar horário"}
                                </Text>
                            </TouchableOpacity>
                        </View>

                        {showTimePicker && (
                            <View style={[styles.pickerWrapper, { backgroundColor: isDark ? colors.border : '#f1f5f9' }]}>
                                <DateTimePicker
                                    value={selectedTime}
                                    mode="time"
                                    textColor={colors.text}
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
                                    <TouchableOpacity style={[styles.confirmBtn, { backgroundColor: colors.primary }]} onPress={() => setShowTimePicker(false)}>
                                        <Text style={styles.confirmBtnText}>Confirmar Hora</Text>
                                    </TouchableOpacity>
                                )}
                            </View>
                        )}

                        <Text style={[styles.label, { color: colors.textSecondary }]}>Categoria da Atividade</Text>
                        <View style={styles.tabs}>
                            <TouchableOpacity style={[styles.tab, { backgroundColor: colors.card, borderColor: colors.border }, type === 'task' && [styles.activeTabTask, { backgroundColor: isDark ? colors.warningBackground : '#fef3c7', borderColor: isDark ? colors.warning : '#fde68a' }]]} onPress={() => setType('task')}>
                                <CheckSquare size={20} color={type === 'task' ? colors.warning : colors.textMuted} />
                                <Text style={[styles.tabText, { color: colors.textSecondary }, type === 'task' && [styles.activeTabTextTask, { color: colors.warning }]]}>Rotina</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.tab, { backgroundColor: colors.card, borderColor: colors.border }, type === 'class' && [styles.activeTabClass, { backgroundColor: isDark ? colors.primaryBackground : '#e0f2fe', borderColor: isDark ? colors.primary : '#bae6fd' }]]} onPress={() => setType('class')}>
                                <BookOpen size={20} color={type === 'class' ? colors.primary : colors.textMuted} />
                                <Text style={[styles.tabText, { color: colors.textSecondary }, type === 'class' && [styles.activeTabTextClass, { color: colors.primary }]]}>Aula</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.tab, { backgroundColor: colors.card, borderColor: colors.border }, type === 'event' && [styles.activeTabEvent, { backgroundColor: isDark ? colors.dangerBackground : '#fce7f3', borderColor: isDark ? colors.danger : '#fbcfe8' }]]} onPress={() => setType('event')}>
                                <CalendarHeart size={20} color={type === 'event' ? colors.danger : colors.textMuted} />
                                <Text style={[styles.tabText, { color: colors.textSecondary }, type === 'event' && [styles.activeTabTextEvent, { color: colors.danger }]]}>Terapia</Text>
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity style={[styles.saveBtn, { backgroundColor: colors.primary }]} onPress={handleSave}>
                            <Text style={styles.saveText}>Adicionar à Agenda</Text>
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
    header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20, alignItems: 'center' },
    title: { fontSize: 22, fontWeight: '800' },
    closeBtn: { padding: 8, borderRadius: 20, borderWidth: 1 },
    scrollContent: { paddingBottom: 20 },
    
    label: { fontSize: 14, fontWeight: '700', marginBottom: 8, marginTop: 16 },
    input: { borderWidth: 1, borderRadius: 16, padding: 16 },
    inputText: { fontSize: 16 },
    
    rowInput: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    iconBg: { padding: 16, borderWidth: 1, borderRadius: 16 },
    
    pickerWrapper: { borderRadius: 16, marginTop: 12, padding: 12, alignItems: 'center' },
    confirmBtn: { paddingHorizontal: 20, paddingVertical: 12, borderRadius: 12, marginTop: 8, width: '100%', alignItems: 'center' },
    confirmBtnText: { color: 'white', fontWeight: 'bold' },

    tabs: { flexDirection: 'row', gap: 8, marginTop: 8 },
    tab: { flex: 1, paddingVertical: 14, alignItems: 'center', borderRadius: 16, borderWidth: 1, gap: 4 },
    tabText: { fontWeight: '600', fontSize: 12 },
    
    activeTabTask: { borderWidth: 1 }, 
    activeTabTextTask: {},
    activeTabClass: { borderWidth: 1 }, 
    activeTabTextClass: {},
    activeTabEvent: { borderWidth: 1 }, 
    activeTabTextEvent: {},
    
    saveBtn: { padding: 18, borderRadius: 16, alignItems: 'center', marginTop: 32 },
    saveText: { color: 'white', fontWeight: 'bold', fontSize: 16 }
});