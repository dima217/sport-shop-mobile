import { useTranslation } from "@/hooks/useTranslation";
import Button from "@/shared/Button";
import { Colors } from "@/constants/design-tokens";
import { StyleSheet, View } from "react-native";

interface ProductFooterProps {
  inStock: boolean;
  onAddToCart: () => void;
  canAddToCart: boolean;
  isLoading: boolean;
}

export const ProductFooter = ({
  inStock,
  onAddToCart,
  canAddToCart,
  isLoading,
}: ProductFooterProps) => {
  const { t } = useTranslation();

  return (
    <View style={styles.footer}>
      <Button
        title={
          inStock ? t("products.addToCart") : t("products.outOfStock")
        }
        onPress={onAddToCart}
        disabled={!canAddToCart || isLoading}
        loading={isLoading}
        style={styles.button}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: Colors.background,
    borderTopWidth: 1,
    borderTopColor: Colors.INPUT_LINE,
  },
  button: {
    width: "100%",
  },
});

