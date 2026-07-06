import React from 'react';
import { Pressable, StyleProp, ViewStyle, Platform } from 'react-native';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withSpring, 
  withTiming 
} from 'react-native-reanimated';

interface BouncingCardProps {
  children: React.ReactNode;
  onPress?: () => void;
  className?: string;
  style?: StyleProp<ViewStyle>;
  scaleTo?: number;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const BouncingCard: React.FC<BouncingCardProps> = ({ 
  children, 
  onPress, 
  className,
  style,
  scaleTo = 0.95 
}) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const handlePressIn = () => {
    if (Platform.OS !== 'web') {
      scale.value = withSpring(scaleTo, { damping: 15, stiffness: 200 });
    } else {
      scale.value = withTiming(scaleTo, { duration: 100 });
    }
  };

  const handlePressOut = () => {
    if (Platform.OS !== 'web') {
      scale.value = withSpring(1, { damping: 15, stiffness: 200 });
    } else {
      scale.value = withTiming(1, { duration: 100 });
    }
  };

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      className={className}
      style={[style, animatedStyle]}
    >
      {children}
    </AnimatedPressable>
  );
};
