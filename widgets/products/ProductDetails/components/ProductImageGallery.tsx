import { Colors } from "@/constants/design-tokens";
import { ThemedText } from "@/shared/core/ThemedText";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";

interface ProductImageGalleryProps {
  images: string[];
  selectedImageIndex: number;
  onImageSelect: (index: number) => void;
  discount?: number;
}

export const ProductImageGallery = ({
  images,
  selectedImageIndex,
  onImageSelect,
  discount,
}: ProductImageGalleryProps) => {
  return (
    <>
      <View style={styles.imageContainer}>
        <Image
          source={{
            uri: images[selectedImageIndex] || images[0] || "",
          }}
          style={styles.mainImage}
        />
        {discount !== undefined && discount > 0 && (
          <View style={styles.discountBadge}>
            <ThemedText style={styles.discountText}>-{discount}%</ThemedText>
          </View>
        )}
      </View>

      {images.length > 1 && (
        <View style={styles.thumbnailContainer}>
          {images.map((image, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => onImageSelect(index)}
              style={[
                styles.thumbnail,
                selectedImageIndex === index && styles.thumbnailSelected,
              ]}
            >
              <Image source={{ uri: image }} style={styles.thumbnailImage} />
            </TouchableOpacity>
          ))}
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  imageContainer: {
    width: "100%",
    height: 400,
    position: "relative",
    backgroundColor: Colors.backgroundSecondary,
  },
  mainImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  discountBadge: {
    position: "absolute",
    top: 16,
    left: 16,
    backgroundColor: Colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  discountText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "bold",
  },
  thumbnailContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  thumbnail: {
    width: 60,
    height: 60,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "transparent",
    overflow: "hidden",
  },
  thumbnailSelected: {
    borderColor: Colors.primary,
  },
  thumbnailImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
});

