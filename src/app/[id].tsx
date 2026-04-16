import { ExtensionStorage } from "@bacons/apple-targets";
import { useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";

const storage = new ExtensionStorage("group.com.pathwaywealth.dev");

export default function NoteDetails() {
  const { id } = useLocalSearchParams();

  const notes = JSON.parse(storage.get("notes") || "[]");
  const note = notes.find((n: any) => n.id === id);

  if (!note) {
    return (
      <View>
        <Text>Note not found</Text>
      </View>
    );
  }

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 24, color: "#fff" }}>{note.title}</Text>

      <Text style={{ marginTop: 10, color: "#ccc" }}>{note.text}</Text>
    </View>
  );
}
