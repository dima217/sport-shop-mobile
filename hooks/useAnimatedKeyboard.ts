import { useEffect, useRef } from "react";
import { Animated, Keyboard, KeyboardEvent, Platform } from "react-native";

const KEYBOARD_SHOW_EVENT =
  Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
const KEYBOARD_HIDE_EVENT =
  Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";
const DEFAULT_KEYBOARD_DURATION = 250;

export function useAnimatedKeyboard() {
  const keyboardHeight = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animateKeyboard = (toValue: number, event: KeyboardEvent) => {
      Animated.timing(keyboardHeight, {
        duration: event.duration || DEFAULT_KEYBOARD_DURATION,
        toValue,
        useNativeDriver: false,
      }).start();
    };

    const resetKeyboard = () => {
      keyboardHeight.stopAnimation();
      keyboardHeight.setValue(0);
    };

    const showSub = Keyboard.addListener(KEYBOARD_SHOW_EVENT, (event) => {
      animateKeyboard(event.endCoordinates.height, event);
    });

    const hideSub = Keyboard.addListener(KEYBOARD_HIDE_EVENT, resetKeyboard);

    // Android: keyboardDidHide fires after dismiss — reset earlier when possible
    const willHideSub =
      Platform.OS === "android"
        ? Keyboard.addListener("keyboardWillHide", resetKeyboard)
        : null;

    return () => {
      showSub.remove();
      hideSub.remove();
      willHideSub?.remove();
    };
  }, [keyboardHeight]);

  return keyboardHeight;
}
