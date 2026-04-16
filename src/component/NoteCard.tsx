import { Button, ContextMenu, Host } from "@expo/ui/swift-ui";
import { StyleSheet, Text, View } from "react-native";
import Animated, {
  LinearTransition,
  SlideInRight,
  SlideOutLeft,
} from "react-native-reanimated";

type Note = {
  id: string;
  title: string;
  text: string;
  createdAt: number;
};

const NoteCard = ({
  note,
  onDelete,
}: {
  note: Note;
  onDelete: (id: string) => void;
}) => {
  const timeStr = new Date(note.createdAt).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <Animated.View
      entering={SlideInRight}
      exiting={SlideOutLeft.duration(250)}
      layout={LinearTransition}
      style={styles.cardWrapper}
    >
      <Host style={{ flex: 1 }}>
        <ContextMenu>
          <ContextMenu.Items>
            <Button
              label="Select"
              systemImage="checkmark"
              onPress={() => {}}
            />
            <Button
              label="Edit"
              systemImage="pencil"
              onPress={() => {}}
            />
            <Button
              label="Delete"
              role="destructive"
              systemImage="trash"
              onPress={() => onDelete(note.id)}
            />
          </ContextMenu.Items>
          <ContextMenu.Trigger>
            <View style={styles.card}>
              <View style={{ flex: 1 }}>
                {note.title ? (
                  <Text style={styles.cardTitle}>{note.title}</Text>
                ) : null}
                <Text style={styles.cardText}>{note.text}</Text>
              </View>
              <Text style={styles.cardTime}>{timeStr}</Text>
            </View>
          </ContextMenu.Trigger>
        </ContextMenu>
      </Host>
    </Animated.View>
  );
};

const CARD_BG = "#1A1A1A";
const BORDER = "#2A2A2A";

const styles = StyleSheet.create({
  cardWrapper: { flex: 1 },
  card: {
    backgroundColor: CARD_BG,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: BORDER,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cardTitle: { color: "#fff", fontWeight: "600" },
  cardText: { color: "#E8E8E8" },
  cardTime: { color: "#555", fontSize: 11 },
});

export default NoteCard;
