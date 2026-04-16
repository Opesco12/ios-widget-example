import { StyleSheet, Text, TouchableOpacity } from "react-native";
import Animated, { ZoomIn } from "react-native-reanimated";

const ACCENT = "#F5A623";

const FAB = ({ onPress }: { onPress: () => void }) => (
  <Animated.View
    entering={ZoomIn}
    style={styles.fabWrapper}
  >
    <TouchableOpacity
      style={styles.fab}
      onPress={onPress}
    >
      <Text style={styles.fabIcon}>+</Text>
    </TouchableOpacity>
  </Animated.View>
);

const styles = StyleSheet.create({
  fabWrapper: { position: "absolute", bottom: 30, right: 20 },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: ACCENT,
    justifyContent: "center",
    alignItems: "center",
  },
  fabIcon: { fontSize: 32, color: "#000" },
});

export default FAB;
