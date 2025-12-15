import './global.css';
import { Text, View } from 'react-native';
import {AACProvider} from './src/context/AACContext';

export default function App() {
  return (
    // Envolvemos TUDO com o Provider
    <AACProvider>
       <MeuAppPrincipal /> 
    </AACProvider>
  );
}

function MeuAppPrincipal() {
    // Agora aqui dentro podemos usar o contexto!
    return <View><Text>App Carregado</Text></View>
}
