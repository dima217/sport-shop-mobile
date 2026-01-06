import { StyleSheet } from "react-native";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";

import { Colors, FONT_FAMILIES, FONT_SIZES } from "@/constants/design-tokens";

const styles = StyleSheet.create({
  container: {
    width: wp("80%"),
  },
  labelContainer: {
    paddingHorizontal: 8,
  },
  label: {
    fontFamily: FONT_FAMILIES.MONTSERRAT_SEMIBOLD,
    fontSize: FONT_SIZES.DEFAULT,
    color: Colors.GREY,
  },
  leftContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  inputContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.INPUT_LINE,
  },
  inputContainerMultiline: {
    alignItems: "flex-start",
    paddingVertical: 4,
  },
  rightContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  errorInputContainer: {
    borderBottomColor: Colors.REJECT,
  },
  disabledInputContainer: {
    backgroundColor: Colors.LIGHT_GREY,
    borderBottomColor: Colors.INPUT_LINE,
  },
  textInput: {
    flex: 1,
    height: 30,
    fontFamily: FONT_FAMILIES.MONTSERRAT_SEMIBOLD,
    fontSize: FONT_SIZES.MEDIUM,
    padding: 0,
    color: Colors.text,
  },
  textInputMultiline: {
    height: undefined,
    minHeight: 30,
    paddingTop: 8,
    paddingBottom: 8,
  },
  errorContainer: {
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  error: {
    fontFamily: FONT_FAMILIES.MONTSERRAT_REGULAR,
    fontSize: FONT_SIZES.SMALL,
    color: Colors.REJECT,
  },
});

export default styles;
