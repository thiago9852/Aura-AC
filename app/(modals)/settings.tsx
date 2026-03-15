// src/app/(modals)/settings.tsx
import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView, Switch } from 'react-native';
import { X, User, LogOut, Monitor, Volume2, Hand, Cloud } from 'lucide-react-native';
import * as Speech from 'expo-speech';
import { useAAC } from '../../src/context/AACContext';
import { useTheme } from '../../src/theme/useTheme';

interface Props {
    visible: boolean;
    onClose: () => void;
}

export default function Settings({ visible, onClose }: Props) {
    const { settings, updateSettings, exportProfile, importProfile } = useAAC();
    const [voices, setVoices] = React.useState<Speech.Voice[]>([]);
    const { colors, isDark } = useTheme();

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
        <View style={[styles.groupContainer, { backgroundColor: colors.card, shadowColor: colors.cardShadow }]}>
            <View style={[styles.groupHeader, { borderBottomColor: colors.border }]}>
                <View style={[styles.iconContainer, { backgroundColor: colors.background }]}>{icon}</View>
                <Text style={[styles.groupTitle, { color: colors.text }]}>{title}</Text>
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
            <View style={[styles.overlay, { backgroundColor: colors.overlay }]}>
                <View style={[styles.modalContent, { backgroundColor: colors.background, shadowColor: colors.cardShadow }]}>
                    {/* Top Header */}
                    <View style={[styles.header, { borderBottomColor: colors.border }]}>
                        <Text style={[styles.title, { color: colors.text }]}>Configurações</Text>
                        <TouchableOpacity onPress={onClose} style={[styles.closeBtn, { backgroundColor: isDark ? colors.border : '#e2e8f0', borderColor: isDark ? colors.textMuted : '#cbd5e1' }]}>
                            <X size={20} color={colors.textSecondary} />
                        </TouchableOpacity>
                    </View>

                    <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
                        {/* Perfil */}
                        <View style={[styles.profileSection, { backgroundColor: colors.card, shadowColor: colors.cardShadow }]}>
                            <View style={[styles.avatar, { backgroundColor: colors.primaryBackground }]}>
                                <User size={32} color={colors.primary} />
                            </View>
                            <View style={styles.profileInfo}>
                                <Text style={[styles.profileName, { color: colors.text }]}>Visitante</Text>
                                <Text style={[styles.profileEmail, { color: colors.textSecondary }]}>Perfil Padrão</Text>
                            </View>
                            <TouchableOpacity style={[styles.logoutBtn, { backgroundColor: colors.dangerBackground }]} onPress={handleLogout}>
                                <LogOut size={20} color={colors.danger} />
                            </TouchableOpacity>
                        </View>

                        {/* Backup e Sincronização */}
                        {renderOptionGroup("Backup e Restauração", <Cloud size={20} color="#0ea5e9" />, (
                            <View style={{ gap: 12 }}>
                                <Text style={[styles.switchDesc, { color: colors.textSecondary }]}>Exporte tudo para um arquivo seguro ou importe para recuperar em outro aparelho.</Text>
                                
                                <TouchableOpacity style={[styles.backupBtnExport, { backgroundColor: isDark ? '#0ea5e920' : '#f0f9ff', borderColor: isDark ? '#0284c7' : '#bae6fd' }]} onPress={exportProfile} activeOpacity={0.7}>
                                    <Text style={[styles.backupBtnTextExp, { color: isDark ? '#38bdf8' : '#0284c7' }]}>Salvar Backup (Exportar)</Text>
                                </TouchableOpacity>

                                <TouchableOpacity style={[styles.backupBtnImport, { backgroundColor: colors.background, borderColor: colors.border }]} onPress={importProfile} activeOpacity={0.7}>
                                    <Text style={[styles.backupBtnTextImp, { color: colors.textSecondary }]}>Restaurar Perfil (Importar)</Text>
                                </TouchableOpacity>
                            </View>
                        ))}

                        {/* Acessibilidade Motora */}
                        {renderOptionGroup("Acessibilidade Motora", <Hand size={20} color="#8b5cf6" />, (
                            <>
                                <Text style={[styles.label, { color: colors.textSecondary }]}>Tamanho dos Botões</Text>
                                <View style={styles.rowChoices}>
                                    {['small', 'medium', 'large'].map((size) => (
                                        <TouchableOpacity
                                            key={size}
                                            style={[styles.chip, { backgroundColor: colors.border }, settings.gridSize === size && { backgroundColor: isDark ? '#8b5cf630' : '#f5f3ff', borderColor: isDark ? '#a78bfa' : '#c4b5fd' }]}
                                            onPress={() => updateSettings({ gridSize: size as any })}
                                            activeOpacity={0.7}
                                        >
                                            <Text style={[styles.chipText, { color: colors.textSecondary }, settings.gridSize === size && { color: isDark ? '#c4b5fd' : '#7c3aed', fontWeight: '800' }]}>
                                                {size === 'small' ? 'Pequeno' : size === 'medium' ? 'Médio' : 'Grande'}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>

                                <View style={styles.switchRow}>
                                    <View style={styles.switchTextContainer}>
                                        <Text style={[styles.switchTitle, { color: colors.text }]}>Clique Duplo</Text>
                                        <Text style={[styles.switchDesc, { color: colors.textSecondary }]}>Exige dois toques rápidos para ativar o botão, evitando cliques não intencionais.</Text>
                                    </View>
                                    <Switch
                                        value={!!settings.doubleClickToSpeak}
                                        onValueChange={(val) => updateSettings({ doubleClickToSpeak: val })}
                                        trackColor={{ false: colors.border, true: '#8b5cf6' }}
                                    />
                                </View>
                            </>
                        ))}

                        {/* Acessibilidade Visual */}
                        {renderOptionGroup("Acessibilidade Visual", <Monitor size={20} color="#f59e0b" />, (
                            <>
                                <Text style={[styles.label, { color: colors.textSecondary }]}>Exibição do Cartão</Text>
                                <View style={styles.rowChoices}>
                                    {[
                                        { value: 'both', label: 'Completo' },
                                        { value: 'icon', label: 'Só Ícone' },
                                        { value: 'text', label: 'Só Texto' }
                                    ].map((mode) => (
                                        <TouchableOpacity
                                            key={mode.value}
                                            style={[styles.chip, { backgroundColor: colors.border }, settings.cardDisplayMode === mode.value && { backgroundColor: isDark ? '#f9731630' : '#fff7ed', borderColor: isDark ? '#fb923c' : '#fdba74' }]}
                                            onPress={() => updateSettings({ cardDisplayMode: mode.value as any })}
                                            activeOpacity={0.7}
                                        >
                                            <Text style={[styles.chipText, { color: colors.textSecondary }, settings.cardDisplayMode === mode.value && { color: isDark ? '#fdba74' : '#ea580c', fontWeight: '800' }]}>
                                                {mode.label}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>

                                <View style={styles.switchRow}>
                                    <View style={styles.switchTextContainer}>
                                        <Text style={[styles.switchTitle, { color: colors.text }]}>Alto Contraste</Text>
                                        <Text style={[styles.switchDesc, { color: colors.textSecondary }]}>Reforça as bordas, remove tons suaves e clarifica o texto para baixa visão.</Text>
                                    </View>
                                    <Switch
                                        value={!!settings.highContrast}
                                        onValueChange={(val) => updateSettings({ highContrast: val })}
                                        trackColor={{ false: colors.border, true: '#f59e0b' }}
                                    />
                                </View>
                            </>
                        ))}

                        {/*Acessibilidade de voz & Feedback */}
                        {renderOptionGroup("Feedback e Voz", <Volume2 size={20} color="#10b981" />, (
                            <>
                                <Text style={[styles.label, { color: colors.textSecondary }]}>Velocidade da Fala</Text>
                                <View style={styles.rowChoices}>
                                    {[0.5, 1.0, 1.5].map((rate) => (
                                        <TouchableOpacity
                                            key={rate}
                                            style={[styles.chip, { backgroundColor: colors.border }, settings.speakingRate === rate && { backgroundColor: isDark ? '#10b98130' : '#ecfdf5', borderColor: isDark ? '#34d399' : '#a7f3d0' }]}
                                            onPress={() => updateSettings({ speakingRate: rate })}
                                        >
                                            <Text style={[styles.chipText, { color: colors.textSecondary }, settings.speakingRate === rate && { color: isDark ? '#34d399' : '#059669', fontWeight: '800' }]}>
                                                {rate}x
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>

                                {/* Switch: Falar Apenas no Play */}
                                <View style={styles.switchRow}>
                                    <View style={styles.switchTextContainer}>
                                        <Text style={[styles.switchTitle, { color: colors.text }]}>Falar Apenas no Play</Text>
                                        <Text style={[styles.switchDesc, { color: colors.textSecondary }]}>Muta o clique em botões para focar apenas na frase completa.</Text>
                                    </View>
                                    <Switch
                                        value={!!settings.speakOnlyOnPlay}
                                        onValueChange={(val) => updateSettings({ speakOnlyOnPlay: val })}
                                        trackColor={{ false: colors.border, true: '#10b981' }}
                                    />
                                </View>
                                
                                {voices.length > 0 && (
                                    <View style={{ marginTop: 16 }}>
                                        <Text style={[styles.label, { color: colors.textSecondary }]}>Timbre da Voz</Text>
                                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 12 }}>
                                            <View style={{ flexDirection: 'row', gap: 8, paddingHorizontal: 2 }}>
                                                <TouchableOpacity
                                                    style={[styles.chip, { backgroundColor: colors.border, paddingHorizontal: 16, minWidth: 100 }, !settings.voiceId && { backgroundColor: isDark ? '#10b98130' : '#ecfdf5', borderColor: isDark ? '#34d399' : '#a7f3d0' }]}
                                                    onPress={() => updateSettings({ voiceId: null })}
                                                >
                                                    <Text style={[styles.chipText, { color: colors.textSecondary }, !settings.voiceId && { color: isDark ? '#34d399' : '#059669', fontWeight: '800' }]}>
                                                        Padrão
                                                    </Text>
                                                </TouchableOpacity>
                                                {voices.map(voice => (
                                                    <TouchableOpacity
                                                        key={voice.identifier}
                                                        style={[styles.chip, { backgroundColor: colors.border, paddingHorizontal: 16, minWidth: 100 }, settings.voiceId === voice.identifier && { backgroundColor: isDark ? '#10b98130' : '#ecfdf5', borderColor: isDark ? '#34d399' : '#a7f3d0' }]}
                                                        onPress={() => updateSettings({ voiceId: voice.identifier })}
                                                    >
                                                        <Text style={[styles.chipText, { color: colors.textSecondary, textAlign: 'center' }, settings.voiceId === voice.identifier && { color: isDark ? '#34d399' : '#059669', fontWeight: '800' }]}>
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
    overlay: { flex: 1, justifyContent: 'flex-end' },
    modalContent: { borderTopLeftRadius: 32, borderTopRightRadius: 32, height: '90%', shadowOffset: { width: 0, height: -10 }, shadowOpacity: 0.1, shadowRadius: 20, elevation: 20 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1 },
    title: { fontSize: 20, fontWeight: '700' },
    closeBtn: { padding: 8, borderRadius: 20, borderWidth: 1 },
    scroll: { flex: 1, padding: 24 },
    profileSection: { flexDirection: 'row', alignItems: 'center', padding: 20, borderRadius: 24, marginBottom: 24, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 2 },
    avatar: { width: 64, height: 64, borderRadius: 32, alignItems: 'center', justifyContent: 'center', marginRight: 16 },
    profileInfo: { flex: 1 },
    profileName: { fontSize: 20, fontWeight: '800' },
    profileEmail: { fontSize: 14, marginTop: 2 },
    logoutBtn: { padding: 12, borderRadius: 16 },
    groupContainer: { borderRadius: 24, marginBottom: 20, overflow: 'hidden', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.03, shadowRadius: 8, elevation: 1 },
    groupHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 20, borderBottomWidth: 1 },
    iconContainer: { padding: 10, borderRadius: 12 },
    groupTitle: { fontSize: 18, fontWeight: '700' },
    groupContent: { padding: 20, paddingTop: 16 },
    label: { fontSize: 14, fontWeight: '700', marginBottom: 12, textTransform: 'uppercase', letterSpacing: 0.5 },
    rowChoices: { flexDirection: 'row', gap: 8, marginBottom: 24 },
    chip: { flex: 1, paddingVertical: 14, borderRadius: 16, alignItems: 'center', borderWidth: 1, borderColor: 'transparent' },
    chipText: { fontSize: 14, fontWeight: '600' },
    switchRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8 },
    switchTextContainer: { flex: 1, paddingRight: 16 },
    switchTitle: { fontSize: 16, fontWeight: '700' },
    switchDesc: { fontSize: 13, marginTop: 4, lineHeight: 18 },

    // Botões de Backup
    backupBtnExport: { borderWidth: 1, padding: 14, borderRadius: 16, alignItems: 'center' },
    backupBtnTextExp: { fontWeight: 'bold', fontSize: 15 },
    backupBtnImport: { borderWidth: 1, padding: 14, borderRadius: 16, alignItems: 'center' },
    backupBtnTextImp: { fontWeight: 'bold', fontSize: 15 },

});