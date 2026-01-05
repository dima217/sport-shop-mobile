import { Review } from "@/api/types/reviews";
import { Colors } from "@/constants/design-tokens";
import { useTranslation } from "@/hooks/useTranslation";
import { ThemedText } from "@/shared/core/ThemedText";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { StarRating } from "./StarRating";

interface ReviewCardProps {
  review: Review;
  onEdit?: () => void;
  onDelete?: () => void;
  isOwnReview?: boolean;
}

export const ReviewCard = ({
  review,
  onEdit,
  onDelete,
  isOwnReview = false,
}: ReviewCardProps) => {
  const { t } = useTranslation();
  const date = new Date(review.createdAt).toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const userName =
    review.user?.firstName && review.user?.lastName
      ? `${review.user.firstName} ${review.user.lastName}`
      : t("reviews.anonymous");

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <View style={styles.avatarPlaceholder}>
            <ThemedText style={styles.avatarText}>
              {userName.charAt(0).toUpperCase()}
            </ThemedText>
          </View>
          <View style={styles.userDetails}>
            <ThemedText style={styles.userName}>{userName}</ThemedText>
            <ThemedText style={styles.date}>{date}</ThemedText>
          </View>
        </View>
        {isOwnReview && (onEdit || onDelete) && (
          <View style={styles.actions}>
            {onEdit && (
              <TouchableOpacity onPress={onEdit} style={styles.actionButton}>
                <FontAwesome name="edit" size={16} color={Colors.primary} />
              </TouchableOpacity>
            )}
            {onDelete && (
              <TouchableOpacity onPress={onDelete} style={styles.actionButton}>
                <FontAwesome name="trash" size={16} color={Colors.REJECT} />
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>

      <View style={styles.ratingContainer}>
        <StarRating rating={review.rating} readonly size={16} />
      </View>

      {review.comment && (
        <ThemedText style={styles.comment}>{review.comment}</ThemedText>
      )}

      {review.updatedAt !== review.createdAt && (
        <ThemedText style={styles.editedLabel}>
          {t("reviews.edited")}
        </ThemedText>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.INPUT_LINE,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  avatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary + "20",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.primary,
  },
  userDetails: {
    flex: 1,
    gap: 2,
  },
  userName: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text,
  },
  date: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  actions: {
    flexDirection: "row",
    gap: 8,
  },
  actionButton: {
    padding: 4,
  },
  ratingContainer: {
    marginBottom: 8,
  },
  comment: {
    fontSize: 15,
    color: Colors.text,
    lineHeight: 22,
    marginBottom: 4,
  },
  editedLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontStyle: "italic",
  },
});
