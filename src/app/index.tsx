import AddNoteBottomSheet from "@/component/AddNoteSheet";
import FAB from "@/component/FAB";
import NoteCard from "@/component/NoteCard";
import { ExtensionStorage } from "@bacons/apple-targets";
import { useLinkingURL } from "expo-linking";
import { useCallback, useEffect, useState } from "react";
import { AppState, FlatList, StyleSheet, Text, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

type Note = {
  id: string;
  title: string;
  text: string;
  createdAt: number;
};

const storage = new ExtensionStorage("group.com.pathwaywealth.dev");
const STORAGE_KEY = "notes";

const persistNotes = (notes: Note[]) => {
  try {
    storage.set(STORAGE_KEY, JSON.stringify(notes));
    ExtensionStorage.reloadWidget();
  } catch (e) {
    console.warn("[NotesStore] persist failed:", e);
  }
};

async function loadPersistedNotes(): Promise<Note[]> {
  try {
    const raw = storage.get(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    console.warn("[NotesStore] load failed:", e);
    return [];
  }
}

const Index = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [bottomSheetOpen, setBottomSheetOpen] = useState(false);
  const [ready, setReady] = useState(false);

  const url = useLinkingURL();

  useEffect(() => {
    if (url?.includes("action=add-note")) {
      setBottomSheetOpen(true);
    }
  }, [url]);

  useEffect(() => {
    loadPersistedNotes().then((saved) => {
      setNotes(saved);
      setReady(true);
    });
  }, []);

  useEffect(() => {
    if (!ready) return;
    persistNotes(notes);
  }, [notes, ready]);

  const addNote = useCallback((title: string, text: string) => {
    setNotes((prev) => [
      {
        id: Date.now().toString(),
        title,
        text,
        createdAt: Date.now(),
      },
      ...prev,
    ]);
  }, []);

  const deleteNote = useCallback((id: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
  }, []);

  useEffect(() => {
    const sub = AppState.addEventListener("change", (state) => {
      if (state === "background") {
        ExtensionStorage.reloadWidget();
      }
    });

    return () => sub.remove();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.root}>
        <Text style={styles.headerTitle}>Notes</Text>

        <FlatList
          data={notes}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <NoteCard
              note={item}
              onDelete={deleteNote}
            />
          )}
        />

        <FAB onPress={() => setBottomSheetOpen(true)} />

        <AddNoteBottomSheet
          isOpen={bottomSheetOpen}
          onClose={() => setBottomSheetOpen(false)}
          onSave={addNote}
        />
      </View>
    </GestureHandlerRootView>
  );
};

const BG = "#0F0F0F";

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: BG, paddingTop: 60 },
  headerTitle: {
    fontSize: 32,
    fontWeight: "700",
    color: "#FFFFFF",
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  list: { paddingHorizontal: 16, paddingBottom: 100, gap: 10 },
});

export default Index;
