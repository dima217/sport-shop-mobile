import { Colors } from "@/constants/design-tokens";
import { Header } from "@/shared/layout/Header";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { TouchableOpacity } from "react-native";

interface ProductDetailsHeaderProps {
  isFavorite: boolean;
  onBack: () => void;
  onFavoritePress: () => void;
}

export const ProductDetailsHeader = ({
  isFavorite,
  onBack,
  onFavoritePress,
}: ProductDetailsHeaderProps) => {
  return (
    <Header
      title=""
      left={
        <TouchableOpacity onPress={onBack}>
          <FontAwesome name="arrow-left" size={24} color={Colors.text} />
        </TouchableOpacity>
      }
      right={
        <TouchableOpacity onPress={onFavoritePress}>
          <FontAwesome
            name={isFavorite ? "heart" : "heart-o"}
            size={24}
            color={isFavorite ? Colors.primary : Colors.text}
          />
        </TouchableOpacity>
      }
    />
  );
};

