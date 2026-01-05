import {
  useCreateReviewMutation,
  useDeleteReviewMutation,
  useGetMyReviewQuery,
  useGetReviewsQuery,
  useUpdateReviewMutation,
} from "@/api";
import { Colors } from "@/constants/design-tokens";
import { useTranslation } from "@/hooks/useTranslation";
import { ThemedText } from "@/shared/core/ThemedText";
import { RootState } from "@/store/store";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { useSelector } from "react-redux";
import { ReviewCard } from "../components/ReviewCard";
import { ReviewForm } from "../components/ReviewForm";

interface ReviewsListProps {
  productId: string;
}

export const ReviewsList = ({ productId }: ReviewsListProps) => {
  const { t } = useTranslation();
  const userId = useSelector((state: RootState) => state.auth.user?.id);
  const userIdNumber = userId ? Number(userId) : null;
  const [page, setPage] = useState(0);
  const limit = 10;

  const { data, isLoading, error, refetch } = useGetReviewsQuery({
    productId,
    limit,
    offset: page * limit,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const { data: myReview } = useGetMyReviewQuery(productId);
  const [deleteReview] = useDeleteReviewMutation();
  const [createReview] = useCreateReviewMutation();
  const [updateReview] = useUpdateReviewMutation();

  const [showForm, setShowForm] = useState(false);
  const [editingReview, setEditingReview] = useState<string | null>(null);

  const handleDelete = (reviewId: string) => {
    Alert.alert(
      t("reviews.deleteConfirm.title"),
      t("reviews.deleteConfirm.message"),
      [
        {
          text: t("common.cancel"),
          style: "cancel",
        },
        {
          text: t("common.delete"),
          style: "destructive",
          onPress: async () => {
            try {
              await deleteReview({ productId, reviewId }).unwrap();
              refetch();
            } catch (error) {
              console.error("Error deleting review:", error);
              Alert.alert(t("reviews.errors.deleteFailed"));
            }
          },
        },
      ]
    );
  };

  const handleEdit = (reviewId: string) => {
    setEditingReview(reviewId);
    setShowForm(true);
  };

  if (isLoading && !data) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <ThemedText style={styles.errorText}>
          {t("reviews.errorLoading")}
        </ThemedText>
      </View>
    );
  }

  const reviews = data?.reviews || [];
  const hasMore = data ? reviews.length < data.total : false;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <ThemedText style={styles.title}>
          {`${t("reviews.title")} (${data?.total || 0})`}
        </ThemedText>
        {data?.averageRating && (
          <View style={styles.ratingSummary}>
            <FontAwesome name="star" size={18} color="#FFD700" />
            <ThemedText style={styles.averageRating}>
              {data.averageRating.toFixed(1)}
            </ThemedText>
          </View>
        )}
      </View>

      {userIdNumber && !myReview && !showForm && (
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowForm(true)}
        >
          <FontAwesome name="plus" size={16} color={Colors.primary} />
          <ThemedText style={styles.addButtonText}>
            {t("reviews.writeReview")}
          </ThemedText>
        </TouchableOpacity>
      )}

      {showForm && (
        <ReviewForm
          initialRating={editingReview && myReview ? myReview.rating : 0}
          initialComment={
            editingReview && myReview ? myReview.comment || "" : ""
          }
          onSubmit={async (rating, comment) => {
            try {
              if (editingReview && myReview) {
                await updateReview({
                  productId,
                  reviewId: myReview.id,
                  data: { rating, comment },
                }).unwrap();
              } else {
                await createReview({
                  productId,
                  rating,
                  comment,
                }).unwrap();
              }
              setShowForm(false);
              setEditingReview(null);
              refetch();
            } catch (error: any) {
              console.error("Error submitting review:", error);
              Alert.alert(
                t("reviews.errors.submitFailed"),
                error?.data?.message || t("reviews.errors.unknown")
              );
            }
          }}
          onCancel={() => {
            setShowForm(false);
            setEditingReview(null);
          }}
          submitLabel={
            editingReview ? t("reviews.update") : t("reviews.submit")
          }
        />
      )}

      {reviews.length === 0 && !showForm ? (
        <View style={styles.emptyContainer}>
          <FontAwesome
            name="comment-o"
            size={48}
            color={Colors.textSecondary}
          />
          <ThemedText style={styles.emptyText}>
            {t("reviews.noReviews")}
          </ThemedText>
          <ThemedText style={styles.emptySubtext}>
            {t("reviews.noReviewsSubtext")}
          </ThemedText>
        </View>
      ) : (
        <FlatList
          data={reviews}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ReviewCard
              review={item}
              isOwnReview={userIdNumber ? item.userId === userIdNumber : false}
              onEdit={
                userIdNumber && item.userId === userIdNumber
                  ? () => handleEdit(item.id)
                  : undefined
              }
              onDelete={
                userIdNumber && item.userId === userIdNumber
                  ? () => handleDelete(item.id)
                  : undefined
              }
            />
          )}
          onEndReached={() => {
            if (hasMore && !isLoading) {
              setPage((p) => p + 1);
            }
          }}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            isLoading && data ? (
              <ActivityIndicator size="small" color={Colors.primary} />
            ) : null
          }
          scrollEnabled={false}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: Colors.text,
  },
  ratingSummary: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  averageRating: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.text,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: Colors.primary + "10",
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.primary,
  },
  loadingContainer: {
    padding: 32,
    alignItems: "center",
  },
  errorContainer: {
    padding: 32,
    alignItems: "center",
  },
  errorText: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: "center",
  },
  emptyContainer: {
    padding: 32,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: "center",
  },
});
