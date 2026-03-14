import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../ui/Header";

export default function Page({ children, style }: { children: React.ReactNode; style?: any }) {
  return (
    <SafeAreaView style={[{ flex: 1, backgroundColor: "#F8FAFC" }, style]}>
      <Header />
      {children}
    </SafeAreaView>
  );
}