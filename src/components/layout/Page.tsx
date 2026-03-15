import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../ui/Header";
import { useTheme } from "../../theme/useTheme";

export default function Page({ children, style }: { children: React.ReactNode; style?: any }) {
  const { colors } = useTheme();
  
  return (
    <SafeAreaView style={[{ flex: 1, backgroundColor: colors.background }, style]}>
      <Header />
      {children}
    </SafeAreaView>
  );
}