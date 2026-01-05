import { Colors } from "@/constants/design-tokens";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { StyleSheet, TouchableOpacity, View } from "react-native";

interface StarRatingProps {
  rating: number;
  onRatingChange?: (rating: number) => void;
  size?: number;
  readonly?: boolean;
  showValue?: boolean;
}

export const StarRating = ({
  rating,
  onRatingChange,
  size = 20,
  readonly = false,
  showValue = false,
}: StarRatingProps) => {
  const handlePress = (value: number) => {
    if (!readonly && onRatingChange) {
      onRatingChange(value);
    }
  };

  return (
    <View style={styles.container}>
      {[1, 2, 3, 4, 5].map((value) => (
        <TouchableOpacity
          key={value}
          onPress={() => handlePress(value)}
          disabled={readonly || !onRatingChange}
          activeOpacity={readonly ? 1 : 0.7}
        >
          <FontAwesome
            name={value <= rating ? "star" : "star-o"}
            size={size}
            color={value <= rating ? "#FFD700" : Colors.textSecondary}
          />
        </TouchableOpacity>
      ))}
      {showValue && (
        <View style={styles.valueContainer}>
          {/* Значение будет отображаться через родительский компонент */}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  valueContainer: {
    marginLeft: 8,
  },
});

