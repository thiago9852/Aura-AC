import React from 'react';
import { View, StyleSheet, SafeAreaView, Text } from 'react-native';
import { AACProvider, useAAC } from './src/context/AACContext';
import Sidebar from './src/components/ui/Sidebar'; // Ou de onde sua sidebar venha
import { GestureHandlerRootView } from 'react-native-gesture-handler';

// Telas Importadas
import HomeScreen from './src/screens/HomeScreen';
import CategoryManager from './src/screens/CategoryManager';

// Componentes de Páginas Vazias (Placeholders)
const FavoritesScreen = () => <Placeholder title="Favoritos" />;
const AgendaScreen = () => <Placeholder title="Agenda" />;
const ProfileScreen = () => <Placeholder title="Configurações" />;

const Placeholder = ({ title }: { title: string }) => (
  <View style={styles.center}>
    <Text style={styles.title}>{title}</Text>
    <Text style={styles.subtitle}>Esta funcionalidade será implementada em breve.</Text>
  </View>
);

function AppContent() {
  const { activeTab } = useAAC();

  // Switch principal de navegação baseado no activeTab do Context
  const renderScreen = () => {
    switch (activeTab) {
      case 'home': return <HomeScreen />;
      case 'favorites': return <HomeScreen />; // A Home depois vai gerenciar os favoritos nela mesma
      case 'agenda': return <AgendaScreen />;
      case 'manage': return <CategoryManager />; // <-- Modificado aqui!
      case 'profile': return <ProfileScreen />;
      default: return <HomeScreen />;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.layout}>
        
        {/* Renderiza a tela baseada no switch */}
        <View style={styles.main}>
          <View style={styles.content}>
            {renderScreen()}
          </View>
        </View>

        {/* Sidebar */}
        <Sidebar />

      </View>
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AACProvider>
        <AppContent />
      </AACProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  layout: {
    flex: 1,
  },
  main: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  content: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1e293b',
  },
  subtitle: {
    fontSize: 16,
    color: '#64748b',
    marginTop: 8,
    textAlign: 'center',
  },
});