import './global.css';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, FlatList } from 'react-native';
import { INITIAL_CATEGORIES } from './src/data/vocab';

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Categorias iniciais:</Text>

      {/* Renderiza a lista de categorias */}
      <FlatList
        data={INITIAL_CATEGORIES}
        keyExtractor={(item) => item.id} // id deve ser string
        renderItem={({ item }) => (
          <Text style={styles.item}>
            {item.name} ({item.items.length} itens)
          </Text>
        )}
      />

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'flex-start',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  item: {
    fontSize: 16,
    marginBottom: 8,
  },
});
