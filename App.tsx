import React from 'react';
import { StatusBar, View, Text } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { AACProvider, useAAC } from './src/context/AACContext';
import Header from './src/components/Header';
import Sidebar from './src/components/Sidebar';
import SymbolGrid from './src/components/SymbolGrid';
import CategoryManager from './src/components/CategoryManager';

// Componente interno do Layout
function MainLayout() {
  const { activeTab } = useAAC();
  
  return (
    // SafeAreaView garante que nada fique atrás do notch ou da barra home
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f8fafc' }}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      
      {/* Topo */}
      <Header />

      {/* Miolo (dinâmico) */}
      <View style={{ flex: 1 }}>
        
        {/* Lógica: Se for HOME, mostra os Símbolos. Se for outra coisa, mostra texto. */}
        {activeTab === 'home' ? (
           <SymbolGrid />
        ) : activeTab === 'manage' ? ( // <--- Nova verificação
           <CategoryManager />
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

export default function App() {
  return (
    <SafeAreaProvider>
      <AACProvider>
        <MainLayout />
      </AACProvider>
    </SafeAreaProvider>
  );
}