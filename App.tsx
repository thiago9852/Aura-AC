import React from 'react';
import { SafeAreaView, StatusBar, View, Text } from 'react-native';
import { AACProvider, useAAC } from './src/context/AACContext';
import Header from './src/components/Header';
import Sidebar from './src/components/Sidebar';

// Componente interno para acessar o contexto e mostrar o nome da aba
function MainLayout() {
  const { activeTab } = useAAC();
  
  return (
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
           (Funcionalidade em desenvolvimento)
        </Text>
      </View>

      {/* Rodapé */}
      <Sidebar />
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <AACProvider>
      <MainLayout />
    </AACProvider>
  );
}