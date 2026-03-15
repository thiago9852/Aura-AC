// src/components/screens/HomeView.tsx
import React, { useState } from "react";
import { View, ScrollView, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import * as Icons from "lucide-react-native";
import { router } from "expo-router";
import { useAAC } from "../../context/AACContext";
import SymbolCard from "../ui/SymbolCard";
import SentenceBar from "../ui/SentenceBar";
import Page from "../layout/Page";
import SymbolActionModal from "../modals/SymbolActionModal";
import { SymbolItem } from "../../types";
import { useTheme } from "../../theme/useTheme";

const { LayoutGrid, Folder, Star, MessageCircle } = Icons;

export default function HomeView() {
  const { categories, addToSentence, speak, settings } = useAAC();
  const [selectedSymbol, setSelectedSymbol] = useState<SymbolItem | null>(null);
  const [showActionModal, setShowActionModal] = useState(false);
  const { colors, isDark } = useTheme();

  const quickAccess = categories.find((c) => c.id === "core");
  const otherCategories = categories.filter((c) => c.id !== "core");

  const handlePressSymbol = (item: any) => {
    if (!settings.speakOnlyOnPlay) {
      speak(item.speechText || item.label);
    } else {
      addToSentence(item);
    }
  };

  const handleLongPressSymbol = (item: SymbolItem) => {
    setSelectedSymbol(item);
    setShowActionModal(true);
  };

  return (
    <Page>
      <SentenceBar />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {quickAccess?.items.length ? (
          <View style={[styles.sectionContainer, { backgroundColor: isDark ? 'rgba(30, 41, 59, 0.4)' : 'rgba(216, 216, 216, 0.4)', borderColor: colors.glassBorder }]}>
            <View style={styles.sectionHeader}>
              <View style={[styles.headerIconBadge, { backgroundColor: colors.primaryBackground, borderColor: colors.glassBorder }]}>
                <Star size={20} color={colors.primary} fill={colors.primary} />
              </View>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Acesso Rápido</Text>
            </View>

            <View style={styles.grid}>
              {quickAccess.items.map((item) => (
                <SymbolCard
                  key={item.id}
                  item={item}
                  onPress={() => handlePressSymbol(item)}
                  onLongPress={() => handleLongPressSymbol(item)}
                />
              ))}
            </View>
          </View>
        ) : null}

        {otherCategories.length > 0 && (
          <View style={[styles.sectionContainer, { backgroundColor: isDark ? 'rgba(30, 41, 59, 0.4)' : 'rgba(216, 216, 216, 0.4)', borderColor: colors.glassBorder, marginTop: quickAccess?.items.length ? 0 : 0 }]}>
            <View style={styles.sectionHeader}>
              <View style={[styles.headerIconBadge, { backgroundColor: colors.secondaryBackground, borderColor: colors.glassBorder }]}>
                <LayoutGrid size={20} color={colors.secondary} />
              </View>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Categorias</Text>
            </View>

            <View style={styles.grid}>
              {otherCategories.map((cat) => {
                const IconComponent = (Icons as any)[cat.icon] || Folder;

                return (
                  <TouchableOpacity
                    key={cat.id}
                    style={[styles.catCard, { backgroundColor: isDark ? `${cat.color}30` : `${cat.color}15`, borderColor: colors.glassBorder }]}
                    onPress={() => router.push(`/category/${cat.id}`)}
                  >
                      <View style={[styles.catIconContainer, { backgroundColor: cat.color, borderColor: colors.glassBorder }]}>
                        <IconComponent size={32} color="white" />
                      </View>
                      <Text style={[styles.catText, { color: colors.text }]}>{cat.name}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}

        {!quickAccess && otherCategories.length === 0 && (
          <View style={styles.emptyState}>
            <MessageCircle size={48} color={colors.textMuted} />
            <Text style={[styles.emptyText, { color: colors.textMuted }]}>Nenhum símbolo configurado</Text>
          </View>
        )}
      </ScrollView>

      <SymbolActionModal
        visible={showActionModal}
        onClose={() => setShowActionModal(false)}
        item={selectedSymbol}
        categoryId="core"
        onEdit={() => {}}
      />
    </Page>
  );
}

const styles = StyleSheet.create({
  content: { padding: 16, paddingBottom: 120, gap: 16 },

  sectionContainer: {
    borderRadius: 24,
    padding: 16,
    borderWidth: 1,
    overflow: 'hidden',
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 12
  },

  headerIconBadge: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "800",
    letterSpacing: -0.5,
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12
  },

  catCard: {
    width: "47.5%",
    borderRadius: 20,
    paddingVertical: 16,
    paddingHorizontal: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
    borderWidth: 1,
  },

  catIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },

  catText: {
    fontWeight: "700",
    fontSize: 16,
    textAlign: "center"
  },


  emptyState: {
    alignItems: "center",
    marginTop: 60
  },

  emptyText: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: "600",
  }
});