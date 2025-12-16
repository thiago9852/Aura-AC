import React from 'react';
import { StatusBar, View, Text } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { AACProvider, useAAC } from './src/context/AACContext';
import Header from './src/components/Header';
import Sidebar from './src/components/Sidebar';

// Componente interno do Layout
function MainLayout() {
  const { activeTab } = useAAC();
  
  return (
    // SafeAreaView garante que nada fique atrás do notch ou da barra home
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f8fafc' }}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      
      {/* Topo */}
      <Header />

      {/* Miolo */}
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ color: '#cbd5e1', fontSize: 18, fontWeight: 'bold' }}>
           Conteúdo: {activeTab.toUpperCase()}
        </Text>
        <Text style={{ color: '#94a3b8', marginTop: 8 }}>
           (Carcaça pronta - Aguardando implementação)
        </Text>
      </View>

      {/* Rodapé */}
      <Sidebar />
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AACProvider>
        <MainLayout />
      </AACProvider>
    </SafeAreaProvider>
  );
}