import { Colors } from "@/constants/design-tokens";
import { LinearGradient, LinearGradientProps } from "expo-linear-gradient";
import { StyleSheet, ViewProps, ViewStyle } from "react-native";

type GradientViewProps = ViewProps & {
  colors?: LinearGradientProps["colors"];
  style?: ViewStyle;
};

const GradientView = ({
  colors = Colors.gradient,
  style,
  children,
}: GradientViewProps) => {
  return (
    <LinearGradient
      colors={colors}
      style={[styles.container, style]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      {children}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default GradientView;
