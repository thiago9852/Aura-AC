import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions, ActivityIndicator } from 'react-native';
import { BlurView } from 'expo-blur';
import { useAAC } from '../context/AACContext';
import { Activity, ShieldCheck } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

export default function LoginScreen() {
    const { login } = useAAC();
    const [loadingProvider, setLoadingProvider] = useState<'google' | 'apple' | null>(null);

    const handleLogin = async (provider: 'google' | 'apple') => {
        setLoadingProvider(provider);
        try {
            await login(provider);
        } catch (error) {
            console.error(error);
            setLoadingProvider(null);
        }
    };

    return (
        <View style={styles.container}>
            {/* Background Decorativo Simulando o App Fundo */}
            <View style={styles.bgCircle1} />
            <View style={styles.bgCircle2} />

            <BlurView intensity={80} tint="light" style={styles.overlay}>
                <View style={styles.content}>

                    <View style={styles.logoContainer}>
                        <View style={styles.logoBg}>
                            <Activity size={48} color="#4f46e5" />
                        </View>
                        <Text style={styles.appName}>Aura AAC</Text>
                        <Text style={styles.appSubtitle}>Para continuar usando sua prancha de comunicação e rotina, conecte sua conta.</Text>
                    </View>

                    <View style={styles.btnGroup}>
                        {/* Google Button */}
                        <TouchableOpacity
                            style={styles.socialBtn}
                            activeOpacity={0.8}
                            onPress={() => handleLogin('google')}
                            disabled={loadingProvider !== null}
                        >
                            {loadingProvider === 'google' ? (
                                <ActivityIndicator color="#0f172a" />
                            ) : (
                                <>
                                    {/* Mock Google Icon using SVG or Text for now */}
                                    <View style={[styles.socialIcon, { backgroundColor: '#ea4335' }]}><Text style={styles.socialIconText}>G</Text></View>
                                    <Text style={styles.socialBtnText}>Continuar com Google</Text>
                                </>
                            )}
                        </TouchableOpacity>

                        {/* Apple Button */}
                        <TouchableOpacity
                            style={[styles.socialBtn, { backgroundColor: '#0f172a' }]}
                            activeOpacity={0.8}
                            onPress={() => handleLogin('apple')}
                            disabled={loadingProvider !== null}
                        >
                            {loadingProvider === 'apple' ? (
                                <ActivityIndicator color="#ffffff" />
                            ) : (
                                <>
                                    <View style={[styles.socialIcon, { backgroundColor: '#ffffff' }]}><Text style={[styles.socialIconText, { color: '#000' }]}></Text></View>
                                    <Text style={[styles.socialBtnText, { color: '#ffffff' }]}>Continuar com Apple</Text>
                                </>
                            )}
                        </TouchableOpacity>
                    </View>

                    <View style={styles.footer}>
                        <ShieldCheck size={16} color="#64748b" />
                        <Text style={styles.footerText}>Seus dados da prancha são salvos automaticamente.</Text>
                    </View>

                </View>
            </BlurView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: 'transparent', justifyContent: 'center', alignItems: 'center' },

    // Background blobs
    bgCircle1: { position: 'absolute', top: -height * 0.1, left: -width * 0.2, width: width * 0.8, height: width * 0.8, borderRadius: 999, backgroundColor: '#e0e7ff', opacity: 0.6 },
    bgCircle2: { position: 'absolute', bottom: -height * 0.2, right: -width * 0.3, width: width * 1.2, height: width * 1.2, borderRadius: 999, backgroundColor: '#fdf4ff', opacity: 0.6 },

    overlay: { flex: 1, width: '100%', alignItems: 'center', justifyContent: 'center', padding: 24 },
    content: { width: '100%', maxWidth: 400, alignItems: 'center' },

    logoContainer: { alignItems: 'center', marginBottom: 60 },
    logoBg: { width: 96, height: 96, backgroundColor: 'white', borderRadius: 32, alignItems: 'center', justifyContent: 'center', shadowColor: '#4f46e5', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.15, shadowRadius: 24, elevation: 10, marginBottom: 24 },
    appName: { fontSize: 32, fontWeight: '900', color: '#0f172a', marginBottom: 12, letterSpacing: -1 },
    appSubtitle: { fontSize: 16, color: '#64748b', textAlign: 'center', lineHeight: 24, paddingHorizontal: 20 },

    btnGroup: { width: '100%', gap: 16 },

    socialBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: 'white', padding: 16, borderRadius: 24, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 12, elevation: 4, height: 64 },
    socialIcon: { position: 'absolute', left: 16, width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
    socialIconText: { color: 'white', fontWeight: 'bold', fontSize: 18 },
    socialBtnText: { fontSize: 16, fontWeight: '700', color: '#0f172a' },

    footer: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 40 },
    footerText: { fontSize: 13, color: '#64748b', fontWeight: '500' }
});
