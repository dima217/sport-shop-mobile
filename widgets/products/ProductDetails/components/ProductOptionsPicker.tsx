import { Colors } from "@/constants/design-tokens";
import { useTranslation } from "@/hooks/useTranslation";
import { ThemedText } from "@/shared/core/ThemedText";
import { Control, Controller, FieldErrors } from "react-hook-form";
import { StyleSheet, TouchableOpacity, View } from "react-native";

export interface ProductOptionsFormData {
  size?: string | null;
  color?: string | null;
}

interface ProductOptionsPickerProps {
  control: Control<ProductOptionsFormData>;
  errors: FieldErrors<ProductOptionsFormData>;
  sizes?: string[] | null;
  colors?: string[] | null;
}

export const ProductOptionsPicker = ({
  control,
  errors,
  sizes,
  colors,
}: ProductOptionsPickerProps) => {
  const { t } = useTranslation();

  const hasMultipleSizes = sizes && sizes.length > 1;
  const hasMultipleColors = colors && colors.length > 1;
  const hasSingleSize = sizes && sizes.length === 1;
  const hasSingleColor = colors && colors.length === 1;

  // Автоматически выбираем единственный размер/цвет
  if (hasSingleSize || hasSingleColor) {
    // Это будет обработано через defaultValues в useForm
  }

  return (
    <View style={styles.container}>
      {sizes && sizes.length > 0 ? (
        <View style={styles.section}>
          <View style={styles.titleContainer}>
            <ThemedText style={styles.sectionTitle}>
              {t("products.size")}
            </ThemedText>
            {hasMultipleSizes ? (
              <ThemedText style={styles.required}>*</ThemedText>
            ) : null}
          </View>
          <Controller
            control={control}
            name="size"
            rules={{
              required: hasMultipleSizes
                ? t("products.errors.sizeRequired")
                : false,
            }}
            defaultValue={hasSingleSize ? sizes[0] : null}
            render={({ field: { value, onChange } }) => (
              <>
                <View style={styles.optionsContainer}>
                  {sizes.map((size) => (
                    <TouchableOpacity
                      key={size}
                      style={[
                        styles.optionButton,
                        value === size && styles.optionButtonSelected,
                      ]}
                      onPress={() => onChange(size)}
                    >
                      <ThemedText
                        style={[
                          styles.optionText,
                          value === size && styles.optionTextSelected,
                        ]}
                      >
                        {size}
                      </ThemedText>
                    </TouchableOpacity>
                  ))}
                </View>
                {errors.size ? (
                  <ThemedText style={styles.errorText}>
                    {errors.size.message}
                  </ThemedText>
                ) : null}
              </>
            )}
          />
        </View>
      ) : null}

      {colors && colors.length > 0 ? (
        <View style={styles.section}>
          <View style={styles.titleContainer}>
            <ThemedText style={styles.sectionTitle}>
              {t("products.color")}
            </ThemedText>
            {hasMultipleColors ? (
              <ThemedText style={styles.required}>*</ThemedText>
            ) : null}
          </View>
          <Controller
            control={control}
            name="color"
            rules={{
              required: hasMultipleColors
                ? t("products.errors.colorRequired")
                : false,
            }}
            defaultValue={hasSingleColor ? colors[0] : null}
            render={({ field: { value, onChange } }) => (
              <>
                <View style={styles.optionsContainer}>
                  {colors.map((color) => (
                    <TouchableOpacity
                      key={color}
                      style={[
                        styles.optionButton,
                        value === color && styles.optionButtonSelected,
                      ]}
                      onPress={() => onChange(color)}
                    >
                      <ThemedText
                        style={[
                          styles.optionText,
                          value === color && styles.optionTextSelected,
                        ]}
                      >
                        {color}
                      </ThemedText>
                    </TouchableOpacity>
                  ))}
                </View>
                {errors.color ? (
                  <ThemedText style={styles.errorText}>
                    {errors.color.message}
                  </ThemedText>
                ) : null}
              </>
            )}
          />
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  section: {
    marginBottom: 8,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text,
  },
  required: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.REJECT,
    marginLeft: 2,
  },
  optionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  optionButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.INPUT_LINE,
    backgroundColor: Colors.backgroundSecondary,
    minWidth: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  optionButtonSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary + "10",
  },
  optionText: {
    fontSize: 14,
    fontWeight: "500",
    color: Colors.text,
  },
  optionTextSelected: {
    color: Colors.primary,
    fontWeight: "600",
  },
  errorText: {
    fontSize: 12,
    color: Colors.REJECT,
    marginTop: 4,
  },
});
