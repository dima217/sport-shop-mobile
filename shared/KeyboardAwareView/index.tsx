import { useAnimatedKeyboard } from "@/hooks/useAnimatedKeyboard";
import { ReactNode } from "react";
import { Animated, StyleProp, ViewStyle } from "react-native";

interface KeyboardAwareViewProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}

const KeyboardAwareView = ({ children, style }: KeyboardAwareViewProps) => {
  const keyboardHeight = useAnimatedKeyboard();

  return (
    <Animated.View style={[style, { paddingBottom: keyboardHeight }]}>
      {children}
    </Animated.View>
  );
};

export default KeyboardAwareView;
