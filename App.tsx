import React from 'react';
import { StatusBar, View, Text } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { AACProvider, useAAC } from './src/context/AACContext';
import { LinearGradient } from 'expo-linear-gradient';
import Header from './src/components/ui/Header';
import Sidebar from './src/components/ui/Sidebar';
import HomeScreen from './src/screens/HomeScreen';
import CategoryManager from './src/screens/CategoryManager';
import AgendaScreen from './src/screens/AgendaScreen';
import LoginScreen from './src/screens/LoginScreen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import SentenceBar from './src/components/ui/SentenceBar';

// Componente interno do Layout
function MainLayout() {
  const { activeTab } = useAAC();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'transparent' }} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent={true} />

      {/* Topo */}
      <Header />

      {/* Barra de Frases (Sempre visível se na Home) */}
      {activeTab === 'home' && <SentenceBar />}

      {/* Miolo (dinâmico) */}
      <View style={{ flex: 1 }}>

        {/* Lógica: Se for HOME ou FAVORITOS, mostra os Símbolos. Se for Agenda, mostra Agenda. */}
        {activeTab === 'home' || activeTab === 'favorites' ? (
          <HomeScreen />
        ) : activeTab === 'manage' ? (
          <CategoryManager />
        ) : activeTab === 'agenda' ? (
          <AgendaScreen />
        ) : (
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ color: '#cbd5e1', fontSize: 18, fontWeight: 'bold' }}>
              {activeTab.toUpperCase()}
            </Text>
            <Text style={{ color: '#94a3b8', marginTop: 8 }}>
              (Em desenvolvimento)
            </Text>
          </View>
        )}

      </View>

      {/* Rodapé */}
      <Sidebar />
    </SafeAreaView>
  );
}

// Portão de Entrada que exige Login
function AppGate() {
  const { user } = useAAC();

  if (!user) {
    return <LoginScreen />;
  }

  return <MainLayout />;
}

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
          <AACProvider>
            <AppGate />
          </AACProvider>
        </View>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}