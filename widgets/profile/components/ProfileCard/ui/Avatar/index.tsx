import { Avatar as RNAvatar } from "react-native-elements";
import { styles } from "./styles";

interface AvatarProps {
  size?: "small" | "medium" | "large" | number;
  title?: string;
}

const Avatar = ({ size, title }: AvatarProps) => {
  if (title) {
    return (
      <RNAvatar
        rounded
        title={title}
        size={size}
        overlayContainerStyle={styles.avatarBackground}
        titleStyle={styles.avatarText}
      />
    );
  }
  return null;
};

export default Avatar;
