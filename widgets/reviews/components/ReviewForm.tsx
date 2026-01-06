import { Colors } from "@/constants/design-tokens";
import { useTranslation } from "@/hooks/useTranslation";
import Button from "@/shared/Button";
import { ThemedText } from "@/shared/core/ThemedText";
import TextInput from "@/shared/TextInput";
import { useState } from "react";
import { Alert, StyleSheet, View } from "react-native";
import { StarRating } from "./StarRating";

interface ReviewFormProps {
  initialRating?: number;
  initialComment?: string;
  onSubmit: (rating: number, comment: string) => Promise<void>;
  onCancel?: () => void;
  submitLabel?: string;
}

export const ReviewForm = ({
  initialRating = 0,
  initialComment = "",
  onSubmit,
  onCancel,
  submitLabel,
}: ReviewFormProps) => {
  const { t } = useTranslation();
  const [rating, setRating] = useState(initialRating);
  const [comment, setComment] = useState(initialComment);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [commentError, setCommentError] = useState<string>("");

  const handleCommentChange = (text: string) => {
    if (text.length <= 2000) {
      setComment(text);
      if (commentError) {
        setCommentError("");
      }
    }
  };

  const validateComment = (text: string): boolean => {
    const trimmed = text.trim();
    if (!trimmed) {
      setCommentError(t("reviews.errors.commentRequired"));
      return false;
    }
    if (trimmed.length < 10) {
      setCommentError(t("reviews.errors.commentMinLength"));
      return false;
    }
    if (trimmed.length > 2000) {
      setCommentError(t("reviews.errors.commentMaxLength"));
      return false;
    }
    setCommentError("");
    return true;
  };

  const handleSubmit = async () => {
    if (rating === 0) {
      Alert.alert(t("reviews.errors.ratingRequired"));
      return;
    }

    if (!validateComment(comment)) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(rating, comment.trim());
    } catch (error) {
      console.error("Error submitting review:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isCommentValid =
    comment.trim().length >= 10 && comment.trim().length <= 2000;

  return (
    <View style={styles.container}>
      <ThemedText style={styles.label}>
        {rating > 0
          ? `${t("reviews.rating")} (${rating}/5)`
          : t("reviews.rating")}
      </ThemedText>
      <View style={styles.ratingContainer}>
        <StarRating rating={rating} onRatingChange={setRating} size={28} />
      </View>

      <TextInput
        label={t("reviews.comment")}
        value={comment}
        onChangeText={handleCommentChange}
        onBlur={() => {
          if (comment.trim()) {
            validateComment(comment);
          }
        }}
        placeholder={t("reviews.commentPlaceholder")}
        multiline
        numberOfLines={6}
        style={styles.commentInput}
        errorMessage={commentError}
      />
      {comment.trim().length > 0 && comment.trim().length < 10 && (
        <ThemedText style={styles.hintText}>
          {t("reviews.commentHint").replace(
            "{{count}}",
            String(10 - comment.trim().length)
          )}
        </ThemedText>
      )}

      <View style={styles.buttons}>
        {onCancel && (
          <Button
            title={t("common.cancel")}
            onPress={onCancel}
            style={[styles.button, styles.cancelButton]}
          />
        )}
        <Button
          title={submitLabel || t("reviews.submit")}
          onPress={handleSubmit}
          loading={isSubmitting}
          disabled={rating === 0 || !isCommentValid}
          style={[styles.button, styles.submitButton]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.INPUT_LINE,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 12,
  },
  ratingContainer: {
    marginBottom: 16,
  },
  commentInput: {
    marginBottom: 16,
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  button: {
    width: "48%",
  },
  cancelButton: {},
  submitButton: {
    paddingHorizontal: 0,
  },
  hintText: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: -12,
    marginBottom: 8,
  },
});
