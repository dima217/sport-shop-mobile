import {
  useAddToCartMutation,
  useAddToFavoritesMutation,
  useGetFavoritesQuery,
  useGetProductQuery,
  useRemoveFromFavoritesMutation,
} from "@/api";
import { Colors } from "@/constants/design-tokens";
import { HEADER_HEIGHT } from "@/shared/layout/Header";
import { ReviewsList } from "@/widgets/reviews/ReviewsList";
import { useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { ScrollView, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ProductDescription } from "./components/ProductDescription";
import { ProductDetailsError } from "./components/ProductDetailsError";
import { ProductDetailsHeader } from "./components/ProductDetailsHeader";
import { ProductDetailsLoading } from "./components/ProductDetailsLoading";
import { ProductFooter } from "./components/ProductFooter";
import { ProductHeader } from "./components/ProductHeader";
import { ProductImageGallery } from "./components/ProductImageGallery";
import {
  ProductOptionsFormData,
  ProductOptionsPicker,
} from "./components/ProductOptionsPicker";
import { ProductPrice } from "./components/ProductPrice";

interface ProductDetailsProps {
  productId: string;
}

export const ProductDetails = ({ productId }: ProductDetailsProps) => {
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState(0);

  const { data: product, isLoading, error } = useGetProductQuery(productId);
  const { data: favoritesData } = useGetFavoritesQuery({
    limit: 100,
    offset: 0,
  });
  const [addToFavorites] = useAddToFavoritesMutation();
  const [removeFromFavorites] = useRemoveFromFavoritesMutation();
  const [addToCart, { isLoading: isAddingToCart }] = useAddToCartMutation();
  const insets = useSafeAreaInsets();
  const headerTotalHeight = HEADER_HEIGHT + insets.top;

  const getDefaultValues = (): ProductOptionsFormData => {
    if (!product) {
      return { size: null, color: null };
    }

    const defaultSize =
      product.sizes && product.sizes.length === 1 ? product.sizes[0] : null;
    const defaultColor =
      product.colors && product.colors.length === 1 ? product.colors[0] : null;

    return {
      size: defaultSize,
      color: defaultColor,
    };
  };

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isValid },
    reset,
  } = useForm<ProductOptionsFormData>({
    defaultValues: getDefaultValues(),
    mode: "onChange",
  });

  useEffect(() => {
    if (product) {
      const defaults = getDefaultValues();
      reset(defaults);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product?.id, product?.sizes, product?.colors]);

  const watchedValues = watch();

  const isFavorite = useMemo(() => {
    return favoritesData?.products.some((p) => p.id === productId) || false;
  }, [favoritesData, productId]);

  const handleFavoritePress = async () => {
    try {
      if (isFavorite) {
        await removeFromFavorites(productId).unwrap();
      } else {
        await addToFavorites(productId).unwrap();
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  const onSubmit = async (data: ProductOptionsFormData) => {
    if (!product) {
      return;
    }

    try {
      await addToCart({
        productId: product.id,
        quantity: 1,
        size: data.size || null,
        color: data.color || null,
      }).unwrap();
      router.navigate("/(tabs)/cart");
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  // Проверяем, можно ли добавить в корзину
  const canAddToCart = useMemo(() => {
    if (!product || !product.inStock) {
      return false;
    }

    const hasMultipleSizes = product.sizes && product.sizes.length > 1;
    const hasMultipleColors = product.colors && product.colors.length > 1;

    // Если есть множественные опции, проверяем что они выбраны
    if (hasMultipleSizes && !watchedValues.size) {
      return false;
    }
    if (hasMultipleColors && !watchedValues.color) {
      return false;
    }

    return isValid;
  }, [product, watchedValues, isValid]);

  const discount = product?.oldPrice
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : 0;

  if (isLoading) {
    return <ProductDetailsLoading />;
  }

  if (error || !product) {
    return <ProductDetailsError />;
  }

  return (
    <View style={styles.container}>
      <ProductDetailsHeader
        isFavorite={isFavorite}
        onBack={() => router.back()}
        onFavoritePress={handleFavoritePress}
      />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={{ paddingTop: headerTotalHeight }}
        showsVerticalScrollIndicator={false}
      >
        <ProductImageGallery
          images={product.images}
          selectedImageIndex={selectedImage}
          onImageSelect={setSelectedImage}
          discount={discount}
        />

        <View style={styles.content}>
          <ProductHeader
            categoryName={product.category?.name}
            productName={product.name}
            rating={product.rating}
            reviewCount={product.reviewCount}
          />

          <ProductPrice price={product.price} oldPrice={product.oldPrice} />

          <ProductOptionsPicker
            control={control}
            errors={errors}
            sizes={product.sizes || null}
            colors={product.colors || null}
          />

          <ProductDescription description={product.description} />

          <View style={styles.section}>
            <ReviewsList productId={product.id} />
          </View>
        </View>
      </ScrollView>

      <ProductFooter
        inStock={product.inStock}
        onAddToCart={handleSubmit(onSubmit)}
        canAddToCart={canAddToCart}
        isLoading={isAddingToCart}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  section: {
    marginBottom: 24,
  },
});
