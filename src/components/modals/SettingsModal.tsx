// src/components/modals/SettingsModal.tsx
import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView, Switch } from 'react-native';
import { X, User, LogOut, Monitor, Volume2, Hand, Cloud } from 'lucide-react-native';
import * as Speech from 'expo-speech';
import { useAAC } from '../../context/AACContext';

interface Props {
    visible: boolean;
    onClose: () => void;
}

export default function SettingsModal({ visible, onClose }: Props) {
    const { settings, updateSettings, exportProfile, importProfile } = useAAC();
    const [voices, setVoices] = React.useState<Speech.Voice[]>([]);

    React.useEffect(() => {
        if (visible) {
            Speech.getAvailableVoicesAsync().then(availableVoices => {
                let localVoices = availableVoices.filter(v => v.language.includes('pt'));
                if (localVoices.length === 0) localVoices = availableVoices.slice(0, 10);
                setVoices(localVoices);
            });
        }
    }, [visible]);

    const handleLogout = async () => {
        onClose();
        console.log('Logout');
    };

    const renderOptionGroup = (title: string, icon: React.ReactNode, children: React.ReactNode) => (
        <View style={styles.groupContainer}>
            <View style={styles.groupHeader}>
                <View style={styles.iconContainer}>{icon}</View>
                <Text style={styles.groupTitle}>{title}</Text>
            </View>
            <View style={styles.groupContent}>
                {children}
            </View>
        </View>
    );

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={styles.modalContent}>
                    {/* Top Header */}
                    <View style={styles.header}>
                        <Text style={styles.title}>Configurações</Text>
                        <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                            <X size={24} color="#64748b" />
                        </TouchableOpacity>
                    </View>

                    <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
                        {/* Perfil */}
                        <View style={styles.profileSection}>
                            <View style={styles.avatar}>
                                <User size={32} color="#3b82f6" />
                            </View>
                            <View style={styles.profileInfo}>
                                <Text style={styles.profileName}>Visitante</Text>
                                <Text style={styles.profileEmail}>Perfil Padrão</Text>
                            </View>
                            <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
                                <LogOut size={20} color="#ef4444" />
                            </TouchableOpacity>
                        </View>

                        {/* Backup e Sincronização */}
                        {renderOptionGroup("Backup e Restauração", <Cloud size={20} color="#0ea5e9" />, (
                            <View style={{ gap: 12 }}>
                                <Text style={styles.switchDesc}>Exporte tudo para um arquivo seguro ou importe para recuperar em outro aparelho.</Text>
                                
                                <TouchableOpacity style={styles.backupBtnExport} onPress={exportProfile} activeOpacity={0.7}>
                                    <Text style={styles.backupBtnTextExp}>Salvar Backup (Exportar)</Text>
                                </TouchableOpacity>

                                <TouchableOpacity style={styles.backupBtnImport} onPress={importProfile} activeOpacity={0.7}>
                                    <Text style={styles.backupBtnTextImp}>Restaurar Perfil (Importar)</Text>
                                </TouchableOpacity>
                            </View>
                        ))}

                        {/* Acessibilidade Motora */}
                        {renderOptionGroup("Acessibilidade Motora", <Hand size={20} color="#8b5cf6" />, (
                            <>
                                <Text style={styles.label}>Tamanho dos Botões</Text>
                                <View style={styles.rowChoices}>
                                    {['small', 'medium', 'large'].map((size) => (
                                        <TouchableOpacity
                                            key={size}
                                            style={[styles.chip, settings.gridSize === size && styles.chipActiveHover]}
                                            onPress={() => updateSettings({ gridSize: size as any })}
                                            activeOpacity={0.7}
                                        >
                                            <Text style={[styles.chipText, settings.gridSize === size && styles.chipTextActive]}>
                                                {size === 'small' ? 'Pequeno' : size === 'medium' ? 'Médio' : 'Grande'}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>

                                <View style={styles.switchRow}>
                                    <View style={styles.switchTextContainer}>
                                        <Text style={styles.switchTitle}>Clique Duplo</Text>
                                        <Text style={styles.switchDesc}>Exige dois toques rápidos para ativar o botão, evitando cliques não intencionais.</Text>
                                    </View>
                                    <Switch
                                        value={!!settings.doubleClickToSpeak}
                                        onValueChange={(val) => updateSettings({ doubleClickToSpeak: val })}
                                        trackColor={{ false: '#cbd5e1', true: '#8b5cf6' }}
                                    />
                                </View>
                            </>
                        ))}

                        {/* Acessibilidade Visual */}
                        {renderOptionGroup("Acessibilidade Visual", <Monitor size={20} color="#f59e0b" />, (
                            <>
                                <Text style={styles.label}>Exibição do Cartão</Text>
                                <View style={styles.rowChoices}>
                                    {[
                                        { value: 'both', label: 'Completo' },
                                        { value: 'icon', label: 'Só Ícone' },
                                        { value: 'text', label: 'Só Texto' }
                                    ].map((mode) => (
                                        <TouchableOpacity
                                            key={mode.value}
                                            style={[styles.chip, settings.cardDisplayMode === mode.value && styles.chipActiveHoverOrange]}
                                            onPress={() => updateSettings({ cardDisplayMode: mode.value as any })}
                                            activeOpacity={0.7}
                                        >
                                            <Text style={[styles.chipText, settings.cardDisplayMode === mode.value && styles.chipTextActiveOrange]}>
                                                {mode.label}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>

                                <View style={styles.switchRow}>
                                    <View style={styles.switchTextContainer}>
                                        <Text style={styles.switchTitle}>Alto Contraste</Text>
                                        <Text style={styles.switchDesc}>Reforça as bordas, remove tons suaves e clarifica o texto para baixa visão.</Text>
                                    </View>
                                    <Switch
                                        value={!!settings.highContrast}
                                        onValueChange={(val) => updateSettings({ highContrast: val })}
                                        trackColor={{ false: '#cbd5e1', true: '#f59e0b' }}
                                    />
                                </View>
                            </>
                        ))}

                        {/*Acessibilidade de voz & Feedback */}
                        {renderOptionGroup("Feedback e Voz", <Volume2 size={20} color="#10b981" />, (
                            <>
                                <Text style={styles.label}>Velocidade da Fala</Text>
                                <View style={styles.rowChoices}>
                                    {[0.5, 1.0, 1.5].map((rate) => (
                                        <TouchableOpacity
                                            key={rate}
                                            style={[styles.chip, settings.speakingRate === rate && styles.chipActiveHoverGreen]}
                                            onPress={() => updateSettings({ speakingRate: rate })}
                                        >
                                            <Text style={[styles.chipText, settings.speakingRate === rate && styles.chipTextActiveGreen]}>
                                                {rate}x
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>

                                {/* Switch: Falar Apenas no Play */}
                                <View style={styles.switchRow}>
                                    <View style={styles.switchTextContainer}>
                                        <Text style={styles.switchTitle}>Falar Apenas no Play</Text>
                                        <Text style={styles.switchDesc}>Muta o clique em botões para focar apenas na frase completa.</Text>
                                    </View>
                                    <Switch
                                        value={!!settings.speakOnlyOnPlay}
                                        onValueChange={(val) => updateSettings({ speakOnlyOnPlay: val })}
                                        trackColor={{ false: '#cbd5e1', true: '#10b981' }}
                                    />
                                </View>
                                
                                {voices.length > 0 && (
                                    <View style={{ marginTop: 16 }}>
                                        <Text style={styles.label}>Timbre da Voz</Text>
                                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 12 }}>
                                            <View style={{ flexDirection: 'row', gap: 8, paddingHorizontal: 2 }}>
                                                <TouchableOpacity
                                                    style={[styles.chip, !settings.voiceId && styles.chipActiveHoverGreen, { paddingHorizontal: 16, minWidth: 100 }]}
                                                    onPress={() => updateSettings({ voiceId: null })}
                                                >
                                                    <Text style={[styles.chipText, !settings.voiceId && styles.chipTextActiveGreen]}>
                                                        Padrão
                                                    </Text>
                                                </TouchableOpacity>
                                                {voices.map(voice => (
                                                    <TouchableOpacity
                                                        key={voice.identifier}
                                                        style={[styles.chip, settings.voiceId === voice.identifier && styles.chipActiveHoverGreen, { paddingHorizontal: 16, minWidth: 100 }]}
                                                        onPress={() => updateSettings({ voiceId: voice.identifier })}
                                                    >
                                                        <Text style={[styles.chipText, settings.voiceId === voice.identifier && styles.chipTextActiveGreen, { textAlign: 'center' }]}>
                                                            {voice.name || voice.identifier}
                                                        </Text>
                                                    </TouchableOpacity>
                                                ))}
                                            </View>
                                        </ScrollView>
                                    </View>
                                )}
                            </>
                        ))}

                        <View style={{ height: 60 }} />
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: { flex: 1, backgroundColor: 'rgba(15, 23, 42, 0.4)', justifyContent: 'flex-end' },
    modalContent: { backgroundColor: '#f8fafc', borderTopLeftRadius: 32, borderTopRightRadius: 32, height: '90%', shadowColor: '#000', shadowOffset: { width: 0, height: -10 }, shadowOpacity: 0.1, shadowRadius: 20, elevation: 20 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 24, borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
    title: { fontSize: 24, fontWeight: '800', color: '#0f172a' },
    closeBtn: { padding: 8, backgroundColor: '#f1f5f9', borderRadius: 99 },
    scroll: { flex: 1, padding: 24 },
    profileSection: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', padding: 20, borderRadius: 24, marginBottom: 24, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 2 },
    avatar: { width: 64, height: 64, borderRadius: 32, backgroundColor: '#eff6ff', alignItems: 'center', justifyContent: 'center', marginRight: 16 },
    profileInfo: { flex: 1 },
    profileName: { fontSize: 20, fontWeight: '800', color: '#0f172a' },
    profileEmail: { fontSize: 14, color: '#64748b', marginTop: 2 },
    logoutBtn: { padding: 12, backgroundColor: '#fef2f2', borderRadius: 16 },
    groupContainer: { backgroundColor: 'white', borderRadius: 24, marginBottom: 20, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.03, shadowRadius: 8, elevation: 1 },
    groupHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 20, borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
    iconContainer: { padding: 10, backgroundColor: '#f8fafc', borderRadius: 12 },
    groupTitle: { fontSize: 18, fontWeight: '700', color: '#1e293b' },
    groupContent: { padding: 20, paddingTop: 16 },
    label: { fontSize: 14, fontWeight: '700', color: '#475569', marginBottom: 12, textTransform: 'uppercase', letterSpacing: 0.5 },
    rowChoices: { flexDirection: 'row', gap: 8, marginBottom: 24 },
    chip: { flex: 1, paddingVertical: 14, borderRadius: 16, backgroundColor: '#f1f5f9', alignItems: 'center', borderWidth: 1, borderColor: 'transparent' },
    chipActiveHover: { backgroundColor: '#f5f3ff', borderColor: '#c4b5fd' },
    chipText: { fontSize: 14, fontWeight: '600', color: '#64748b' },
    chipTextActive: { color: '#7c3aed', fontWeight: '800' },
    chipActiveHoverOrange: { backgroundColor: '#fff7ed', borderColor: '#fdba74' },
    chipTextActiveOrange: { color: '#ea580c', fontWeight: '800' },
    chipActiveHoverGreen: { backgroundColor: '#ecfdf5', borderColor: '#a7f3d0' },
    chipTextActiveGreen: { color: '#059669', fontWeight: '800' },
    switchRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8 },
    switchTextContainer: { flex: 1, paddingRight: 16 },
    switchTitle: { fontSize: 16, fontWeight: '700', color: '#334155' },
    switchDesc: { fontSize: 13, color: '#94a3b8', marginTop: 4, lineHeight: 18 },

    // Botões de Backup
    backupBtnExport: { backgroundColor: '#f0f9ff', borderWidth: 1, borderColor: '#bae6fd', padding: 14, borderRadius: 16, alignItems: 'center' },
    backupBtnTextExp: { color: '#0284c7', fontWeight: 'bold', fontSize: 15 },
    backupBtnImport: { backgroundColor: '#f8fafc', borderWidth: 1, borderColor: '#e2e8f0', padding: 14, borderRadius: 16, alignItems: 'center' },
    backupBtnTextImp: { color: '#475569', fontWeight: 'bold', fontSize: 15 },

});