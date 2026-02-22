// src/components/Sidebar.tsx
import React, { useEffect } from 'react';
import { View, StyleSheet, useWindowDimensions } from 'react-native';
import { Home, Star, Calendar, FolderCog } from 'lucide-react-native';
import { useAAC } from '../../context/AACContext';
import { NavigationTab } from '../../types';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolate,
  runOnJS,
  interpolateColor,
  useDerivedValue,
  withSequence,
  withTiming,
  Extrapolate,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import * as Haptics from 'expo-haptics';
import { BlurView } from 'expo-blur';

const TABS = [
  { id: 'home', icon: Home, label: 'Início' },
  { id: 'favorites', icon: Star, label: 'Favoritos' },
  { id: 'agenda', icon: Calendar, label: 'Agenda' },
  { id: 'manage', icon: FolderCog, label: 'Gerenciar' },
] as const;

const LIQUID_SPRING = { damping: 11, stiffness: 120, mass: 0.5 };
const ACTIVE_BLUE = '#007AFF';

export default function Sidebar() {
  const { activeTab, setActiveTab } = useAAC();
  const { width: windowWidth } = useWindowDimensions();

  const BAR_HEIGHT = 62;
  const BAR_WIDTH = windowWidth - 50;
  const TAB_WIDTH = BAR_WIDTH / TABS.length;
  const BUBBLE_WIDTH = TAB_WIDTH * 0.94;
  const BUBBLE_HEIGHT = 54;

  const translateX = useSharedValue(0);
  const scaleX = useSharedValue(1);
  const scaleY = useSharedValue(1);
  const interactionFactor = useSharedValue(0); // 0 parado, 1 interagindo
  const contextX = useSharedValue(0);

  useEffect(() => {
    const index = TABS.findIndex((t) => t.id === activeTab);
    const targetX = (index * TAB_WIDTH) + (TAB_WIDTH - BUBBLE_WIDTH) / 2;
    translateX.value = withSpring(targetX, LIQUID_SPRING);
  }, [activeTab, TAB_WIDTH]);

  const switchTab = (tab: NavigationTab) => {
    if (activeTab !== tab) {
      setActiveTab(tab);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  };

  const panGesture = Gesture.Pan()
    .onBegin(() => {
      contextX.value = translateX.value;
      interactionFactor.value = withTiming(1, { duration: 150 });
      runOnJS(Haptics.impactAsync)(Haptics.ImpactFeedbackStyle.Light);
    })
    .onUpdate((event) => {
      const maxTranslate = BAR_WIDTH - BUBBLE_WIDTH;
      let newX = contextX.value + event.translationX;
      if (newX < 0) newX = newX * 0.15;
      if (newX > maxTranslate) newX = maxTranslate + (newX - maxTranslate) * 0.15;
      translateX.value = newX;

      const absVel = Math.abs(event.velocityX);
      scaleX.value = interpolate(absVel, [0, 3000], [1, 1.7], Extrapolate.CLAMP);
      scaleY.value = interpolate(absVel, [0, 3000], [1.5, 2.0], Extrapolate.CLAMP);
    })
    .onFinalize(() => {
      interactionFactor.value = withTiming(0, { duration: 250 });
      scaleX.value = withSpring(1, LIQUID_SPRING);
      scaleY.value = withSpring(1, LIQUID_SPRING);
      const index = Math.round(translateX.value / TAB_WIDTH);
      const safeIndex = Math.max(0, Math.min(index, TABS.length - 1));
      const targetX = (safeIndex * TAB_WIDTH) + (TAB_WIDTH - BUBBLE_WIDTH) / 2;
      translateX.value = withSpring(targetX, LIQUID_SPRING);
      runOnJS(switchTab)(TABS[safeIndex].id);
    });

  const bubbleAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value },
        { scaleX: scaleX.value },
        { scaleY: scaleY.value },
      ],
      // Ao interagir, a bolha fica mais "etérea"
      opacity: interpolate(interactionFactor.value, [0, 1], [1, 0.6]),
    };
  });

  const innerBubbleStyle = useAnimatedStyle(() => {
    return {
      // Borda some no arraste/clique e o fundo fica 100% transparente
      borderColor: interpolateColor(
        interactionFactor.value,
        [0, 1],
        ['rgba(59,130,246,0.3)', 'rgba(59,130,246,0.1)']
      ),
      backgroundColor: interpolateColor(
        interactionFactor.value,
        [0, 1],
        ['rgba(59,130,246,0.15)', 'rgba(59,130,246,0.05)']
      ),
      borderWidth: interpolate(interactionFactor.value, [0, 1], [1.5, 0.5]),
    };
  });

  return (
    <View style={styles.container}>
      <View style={[styles.mainWrapper, { width: BAR_WIDTH, height: BAR_HEIGHT }]}>
        <View style={StyleSheet.absoluteFill}>
          <View style={styles.blurMask}>
            <BlurView intensity={90} tint="light" style={StyleSheet.absoluteFill} />
          </View>
        </View>

        <GestureDetector gesture={panGesture}>
          <View style={styles.contentContainer}>

            <Animated.View style={[styles.bubble, { width: BUBBLE_WIDTH, height: BUBBLE_HEIGHT }, bubbleAnimatedStyle]}>
              <Animated.View style={[styles.bubbleInnerContainer, innerBubbleStyle]}>
                {/* O BlurView permanece para dar a sensação de vidro distorcendo o fundo */}
                <BlurView intensity={10} tint="light" style={StyleSheet.absoluteFill} />

                {/* Um brilho especular que só aumenta na interação */}
                <Animated.View style={[styles.topRefraction, {
                  opacity: interpolate(interactionFactor.value, [0, 1], [0.4, 0.8])
                }]} />
              </Animated.View>
            </Animated.View>

            {TABS.map((tab, i) => {
              const tapGesture = Gesture.Tap().onEnd(() => {
                interactionFactor.value = withSequence(
                  withTiming(1, { duration: 100 }),
                  withTiming(0, { duration: 300 })
                );
                scaleY.value = withSequence(withTiming(1.9, { duration: 120 }), withSpring(1, LIQUID_SPRING));
                runOnJS(switchTab)(tab.id);
              });

              return (
                <GestureDetector key={tab.id} gesture={tapGesture}>
                  <View style={[styles.tabButton, { width: TAB_WIDTH }]}>
                    <TabItem
                      Icon={tab.icon}
                      label={tab.label}
                      isActive={activeTab === tab.id}
                      bubbleX={translateX}
                      tabWidth={TAB_WIDTH}
                      bubbleWidth={BUBBLE_WIDTH}
                      index={i}
                    />
                  </View>
                </GestureDetector>
              );
            })}
          </View>
        </GestureDetector>
      </View>
    </View>
  );
}

function TabItem({ Icon, label, isActive, bubbleX, tabWidth, bubbleWidth, index }: any) {
  const centerX = (index * tabWidth) + (tabWidth / 2);
  const proximity = useDerivedValue(() => {
    const bubbleCenter = bubbleX.value + (bubbleWidth / 2);
    return interpolate(Math.abs(bubbleCenter - centerX), [0, tabWidth * 0.45], [1, 0], Extrapolate.CLAMP);
  });

  const inactiveIconStyle = useAnimatedStyle(() => ({
    opacity: interpolate(proximity.value, [0, 1], [1, 0]),
  }));

  const blueIconStyle = useAnimatedStyle(() => ({
    opacity: interpolate(proximity.value, [0, 1], [0, 1]),
    shadowColor: ACTIVE_BLUE,
    shadowOpacity: interpolate(proximity.value, [0, 1], [0, 0.3]),
    shadowRadius: 10,
  }));

  const labelStyle = useAnimatedStyle(() => ({
    color: interpolateColor(proximity.value, [0, 1], ['#64748b', ACTIVE_BLUE]),
  }));

  return (
    <View style={styles.iconWrapper}>
      <View style={styles.iconContainer}>
        <Animated.View style={[StyleSheet.absoluteFill, styles.centerAll, inactiveIconStyle]}>
          <Icon size={22} color="#64748b" strokeWidth={2.4} />
        </Animated.View>
        <Animated.View style={[styles.centerAll, blueIconStyle]}>
          <Icon size={22} color={ACTIVE_BLUE} strokeWidth={2.6} />
        </Animated.View>
      </View>
      <Animated.Text style={[styles.label, labelStyle]}>{label}</Animated.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { position: 'absolute', bottom: 35, left: 0, right: 0, alignItems: 'center', zIndex: 1000 },
  mainWrapper: { overflow: 'visible', justifyContent: 'center', alignItems: 'center' },
  blurMask: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 100,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.8)',
    backgroundColor: 'rgba(255,255,255,0.6)',
  },
  contentContainer: { flex: 1, flexDirection: 'row', alignItems: 'center', overflow: 'visible' },
  bubble: {
    position: 'absolute',
    top: 3,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 15,
    pointerEvents: 'none',
  },
  bubbleInnerContainer: {
    flex: 1,
    borderRadius: 999,
    overflow: 'hidden',
  },
  topRefraction: {
    position: 'absolute',
    top: 0,
    left: '10%',
    right: '10%',
    height: 4,
    borderTopWidth: 2,
    borderTopColor: 'rgba(255,255,255,0.8)',
    borderRadius: 100,
  },
  tabButton: { height: '100%', justifyContent: 'center', alignItems: 'center', zIndex: 20 },
  iconWrapper: { alignItems: 'center', justifyContent: 'center' },
  iconContainer: { width: 24, height: 24, justifyContent: 'center', alignItems: 'center' },
  centerAll: { justifyContent: 'center', alignItems: 'center' },
  label: { fontSize: 9, fontWeight: '900', marginTop: 3, textAlign: 'center', letterSpacing: -0.2 }
});