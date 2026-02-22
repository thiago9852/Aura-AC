import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView, Switch } from 'react-native';
import { X, User, LogOut, Type, Monitor, Volume2, Hand, MousePointerClick, MessageSquare } from 'lucide-react-native';
import * as Speech from 'expo-speech';
import { useAAC } from '../../context/AACContext';

interface Props {
    visible: boolean;
    onClose: () => void;
}

export default function SettingsModal({ visible, onClose }: Props) {
    const { user, logout, settings, updateSettings } = useAAC();
    const [voices, setVoices] = React.useState<Speech.Voice[]>([]);

    React.useEffect(() => {
        // Carrega as vozes do sistema
        Speech.getAvailableVoicesAsync().then(availableVoices => {
            // Filtra primeiro para vozes em português, se não tiver, mostra todas
            let localVoices = availableVoices.filter(v => v.language.includes('pt'));
            if (localVoices.length === 0) localVoices = availableVoices.slice(0, 10);

            setVoices(localVoices);
        });
    }, []);

    const handleLogout = async () => {
        onClose();
        // Um pequeno delay pro modal fechar antes da tela deslogar visualmente
        setTimeout(async () => {
            await logout();
        }, 300);
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
                        <Text style={styles.title}>Perfil e Configurações</Text>
                        <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                            <X size={24} color="#64748b" />
                        </TouchableOpacity>
                    </View>

                    <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
                        {/* User Info */}
                        <View style={styles.profileSection}>
                            <View style={styles.avatar}>
                                <User size={32} color="#3b82f6" />
                            </View>
                            <View style={styles.profileInfo}>
                                <Text style={styles.profileName}>{user ? user.name : 'Visitante'}</Text>
                                <Text style={styles.profileEmail}>{user ? user.email : 'Perfil Padrão'}</Text>
                            </View>
                            <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
                                <LogOut size={20} color="#ef4444" />
                            </TouchableOpacity>
                        </View>

                        {/* Acessibility Motor */}
                        {renderOptionGroup("Acessibilidade Motora", <Hand size={20} color="#8b5cf6" />, (
                            <>
                                <Text style={styles.label}>Tamanho dos Botões (Grid)</Text>
                                <View style={styles.rowChoices}>
                                    {['small', 'medium', 'large'].map((size) => (
                                        <TouchableOpacity
                                            key={size}
                                            style={[styles.chip, settings.gridSize === size && styles.chipActiveHover]}
                                            onPress={() => updateSettings({ gridSize: size as any })}
                                        >
                                            <Text style={[styles.chipText, settings.gridSize === size && styles.chipTextActive]}>
                                                {size === 'small' ? 'Pequeno' : size === 'medium' ? 'Médio' : 'Gigante'}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>

                                <View style={styles.switchRow}>
                                    <View style={styles.switchTextContainer}>
                                        <Text style={styles.switchTitle}>Clique Duplo Necessário</Text>
                                        <Text style={styles.switchDesc}>Evita apertos não-intencionais exigindo dois toques rápidos para ativar o botão.</Text>
                                    </View>
                                    <Switch
                                        value={settings.doubleClickToSpeak}
                                        onValueChange={(val) => updateSettings({ doubleClickToSpeak: val })}
                                        trackColor={{ false: '#cbd5e1', true: '#8b5cf6' }}
                                    />
                                </View>
                            </>
                        ))}

                        {/* Acessibility Visual */}
                        {renderOptionGroup("Acessibilidade Visual", <Monitor size={20} color="#f59e0b" />, (
                            <>
                                <View style={styles.switchRow}>
                                    <View style={styles.switchTextContainer}>
                                        <Text style={styles.switchTitle}>Alto Contraste</Text>
                                        <Text style={styles.switchDesc}>Reforça as bordas, remove tons suaves e clarifica o texto para baixa visão.</Text>
                                    </View>
                                    <Switch
                                        value={settings.highContrast}
                                        onValueChange={(val) => updateSettings({ highContrast: val })}
                                        trackColor={{ false: '#cbd5e1', true: '#f59e0b' }}
                                    />
                                </View>
                            </>
                        ))}

                        {/* Acessibility Voice & Feedback */}
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

                                <View style={styles.switchRow}>
                                    <View style={styles.switchTextContainer}>
                                        <Text style={styles.switchTitle}>Falar Apenas no Play</Text>
                                        <Text style={styles.switchDesc}>Muta o clique em botões individuais para focar apenas na frase completa lá em baixo.</Text>
                                    </View>
                                    <Switch
                                        value={settings.speakOnlyOnPlay}
                                        onValueChange={(val) => updateSettings({ speakOnlyOnPlay: val })}
                                        trackColor={{ false: '#cbd5e1', true: '#10b981' }}
                                    />
                                </View>

                                {voices.length > 0 && (
                                    <View style={{ marginTop: 16 }}>
                                        <Text style={styles.label}>Timbre da Voz</Text>
                                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 12 }}>
                                            <View style={{ flexDirection: 'row', gap: 8, paddingHorizontal: 2 }}>
                                                {/* Opção Padrão do Sistema */}
                                                <TouchableOpacity
                                                    style={[styles.chip, !settings.voiceId && styles.chipActiveHoverGreen, { paddingHorizontal: 16, minWidth: 100 }]}
                                                    onPress={() => updateSettings({ voiceId: null })}
                                                >
                                                    <Text style={[styles.chipText, !settings.voiceId && styles.chipTextActiveGreen]}>
                                                        Padrão do Sistema
                                                    </Text>
                                                </TouchableOpacity>

                                                {/* Vozes Listadas */}
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

                        <View style={{ height: 40 }} />
                    </ScrollView>
                </View>
            </View>
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
        backgroundColor: '#f8fafc',
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        height: '90%',
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
        borderBottomColor: '#f1f5f9',
    },
    title: { fontSize: 24, fontWeight: '800', color: '#0f172a' },
    closeBtn: { padding: 8, backgroundColor: '#f1f5f9', borderRadius: 99 },
    scroll: { flex: 1, padding: 24 },

    profileSection: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 24,
        marginBottom: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2
    },
    avatar: { width: 64, height: 64, borderRadius: 32, backgroundColor: '#eff6ff', alignItems: 'center', justifyContent: 'center', marginRight: 16 },
    profileInfo: { flex: 1 },
    profileName: { fontSize: 20, fontWeight: '800', color: '#0f172a' },
    profileEmail: { fontSize: 14, color: '#64748b', marginTop: 2 },
    logoutBtn: { padding: 12, backgroundColor: '#fef2f2', borderRadius: 16 },

    groupContainer: {
        backgroundColor: 'white',
        borderRadius: 24,
        marginBottom: 20,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.03,
        shadowRadius: 8,
        elevation: 1,
    },
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

    chipActiveHoverGreen: { backgroundColor: '#ecfdf5', borderColor: '#a7f3d0' },
    chipTextActiveGreen: { color: '#059669', fontWeight: '800' },

    switchRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
    switchTextContainer: { flex: 1, paddingRight: 16 },
    switchTitle: { fontSize: 16, fontWeight: '700', color: '#334155' },
    switchDesc: { fontSize: 13, color: '#94a3b8', marginTop: 4, lineHeight: 18 },
});
