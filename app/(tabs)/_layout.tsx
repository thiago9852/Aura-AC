// app/(tabs)/_layout.tsx
import { Icon, Label, NativeTabs } from "expo-router/unstable-native-tabs";

export default function TabsLayout() {
  return (
    <NativeTabs>

      <NativeTabs.Trigger name="index">
        <Icon sf="house.fill" />
        <Label>Início</Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="favorites">
        <Icon sf="star.fill" />
        <Label>Favoritos</Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="agenda">
        <Icon sf="calendar" />
        <Label>Agenda</Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="manage">
        <Icon sf="folder.fill" />
        <Label>Gerenciar</Label>
      </NativeTabs.Trigger>

    </NativeTabs>
  );
}