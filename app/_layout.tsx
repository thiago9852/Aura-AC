// app/_layout.tsx
import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AACProvider } from "../src/context/AACContext";
import "../src/styles/global.css";

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AACProvider>
          <Stack
            screenOptions={{
              headerShown: false,
              animation: "ios_from_right",
              gestureEnabled: true
            }}
          >
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="category/[id]" />
            <Stack.Screen
              name="(modals)/settings"
              options={{ presentation: "modal" }}
            />
          </Stack>
        </AACProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}