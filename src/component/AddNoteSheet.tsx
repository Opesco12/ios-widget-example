import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetTextInput,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { useEffect, useRef, useState } from "react";
import { Keyboard, StyleSheet, Text, TouchableOpacity } from "react-native";

const AddNoteBottomSheet = ({
  isOpen,
  onClose,
  onSave,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSave: (title: string, text: string) => void;
}) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const bottomSheetRef = useRef<BottomSheet>(null);

  const handleSave = () => {
    if (!content.trim()) return;
    onSave(title.trim(), content.trim());
    setTitle("");
    setContent("");
    Keyboard.dismiss();

    onClose();
  };

  useEffect(() => {
    if (isOpen) {
      bottomSheetRef.current?.snapToIndex(0);
    } else {
      bottomSheetRef.current?.close();
    }
  }, [isOpen]);

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={isOpen ? 0 : -1}
      snapPoints={["50%"]}
      enablePanDownToClose
      onClose={onClose}
      keyboardBehavior="interactive"
      backgroundStyle={styles.bottomSheetBackground}
      handleIndicatorStyle={styles.bottomSheetHandle}
      backdropComponent={(props) => (
        <BottomSheetBackdrop
          {...props}
          disappearsOnIndex={-1}
          appearsOnIndex={0}
          pressBehavior="close"
        />
      )}
    >
      <BottomSheetView style={styles.bottomSheetContent}>
        <Text style={styles.sheetTitle}>New Note</Text>

        <BottomSheetTextInput
          style={styles.titleInput}
          placeholder="Title (optional)"
          placeholderTextColor="#888"
          value={title}
          onChangeText={setTitle}
        />

        <BottomSheetTextInput
          style={styles.contentInput}
          placeholder="Write your note here..."
          placeholderTextColor="#888"
          value={content}
          onChangeText={setContent}
          multiline
        />

        <TouchableOpacity
          style={styles.saveBtn}
          onPress={handleSave}
        >
          <Text style={styles.saveBtnText}>Save Note</Text>
        </TouchableOpacity>
      </BottomSheetView>
    </BottomSheet>
  );
};

const ACCENT = "#F5A623";

const styles = StyleSheet.create({
  bottomSheetBackground: { backgroundColor: "#1A1A1A" },
  bottomSheetHandle: { backgroundColor: "#555" },
  bottomSheetContent: { padding: 20, gap: 16 },
  sheetTitle: { fontSize: 22, color: "#fff", fontWeight: "700" },
  titleInput: { backgroundColor: "#222", color: "#fff", padding: 12 },
  contentInput: {
    backgroundColor: "#222",
    color: "#fff",
    padding: 12,
    minHeight: 120,
  },
  saveBtn: { backgroundColor: ACCENT, padding: 14, borderRadius: 10 },
  saveBtnText: { textAlign: "center", fontWeight: "700" },
});

export default AddNoteBottomSheet;
