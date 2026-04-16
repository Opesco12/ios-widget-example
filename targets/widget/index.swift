import SwiftUI
import WidgetKit

// ─── Shared Model ─────────────────────────────────────────────────────────────

struct Note: Codable, Identifiable {
    let id: String
    let title: String
    let text: String
    let createdAt: Double // Unix ms

    var preview: String {
        let words = text.split(separator: " ").prefix(6).joined(separator: " ")
        return text.count > words.count ? words + "…" : words
    }
}

// ─── App Group Store ──────────────────────────────────────────────────────────

struct NotesStore {
    static let appGroup = "group.com.pathwaywealth.dev"
    static let key = "notes"

    static func load() -> [Note] {
        guard
            let defaults = UserDefaults(suiteName: appGroup),
            let json = defaults.string(forKey: key),
            let data = json.data(using: .utf8),
            let notes = try? JSONDecoder().decode([Note].self, from: data)
        else { return [] }

        return notes
    }
}

// ─── Timeline ─────────────────────────────────────────────────────────────────

struct NotesEntry: TimelineEntry {
    let date: Date
    let notes: [Note]
}

struct NotesProvider: TimelineProvider {
    func placeholder(in context: Context) -> NotesEntry {
        NotesEntry(date: .now, notes: [])
    }

    func getSnapshot(in context: Context, completion: @escaping (NotesEntry) -> Void) {
        completion(NotesEntry(date: .now, notes: NotesStore.load()))
    }

    func getTimeline(in context: Context, completion: @escaping (Timeline<NotesEntry>) -> Void) {
        let entry = NotesEntry(date: .now, notes: NotesStore.load())
        let next = Calendar.current.date(byAdding: .minute, value: 15, to: .now)!
        completion(Timeline(entries: [entry], policy: .after(next)))
    }
}

// ─── Note Row ─────────────────────────────────────────────────────────────────

struct NoteRow: View {
    let note: Note

    var body: some View {
        VStack(alignment: .leading, spacing: 2) {
            if !note.title.isEmpty {
                Text(note.title)
                    .font(.system(size: 12, weight: .semibold))
                    .foregroundColor(.white)
                    .lineLimit(1)
            }
            Text(note.preview)
                .font(.system(size: 11))
                .foregroundColor(Color.white.opacity(0.5))
                .lineLimit(1)
        }
        .frame(maxWidth: .infinity, alignment: .leading)
    }
}

// ─── Widget View ──────────────────────────────────────────────────────────────

struct NotesWidgetView: View {
    let entry: NotesEntry

    private let addNoteURL = URL(string: "mynotes://?action=add-note")!

    var body: some View {
        VStack(alignment: .leading, spacing: 0) {

            // Header row
            HStack(alignment: .center) {
                Text("Notes")
                    .font(.system(size: 14, weight: .bold))
                    .foregroundColor(.white)
                Spacer()
                Link(destination: addNoteURL) {
                    Image(systemName: "plus.circle.fill")
                        .font(.system(size: 20))
                        .foregroundColor(Color(red: 0.96, green: 0.65, blue: 0.14))
                }
            }
            .padding(.bottom, 10)

            if entry.notes.isEmpty {
                Spacer()
                Text("No notes yet.\nTap + to add one.")
                    .font(.system(size: 11))
                    .foregroundColor(Color.white.opacity(0.3))
                    .multilineTextAlignment(.center)
                    .frame(maxWidth: .infinity)
                Spacer()
            } else {
                let recent = Array(entry.notes.prefix(3))
                VStack(alignment: .leading, spacing: 8) {
                    ForEach(Array(recent.enumerated()), id: \.element.id) { index, note in
                        NoteRow(note: note)
                        if index < recent.count - 1 {
                            Rectangle()
                                .fill(Color.white.opacity(0.07))
                                .frame(height: 1)
                        }
                    }
                }
            }

            Spacer(minLength: 0)
        }
        .padding(14)
        .containerBackground(Color(red: 0.09, green: 0.09, blue: 0.09), for: .widget)
    }
}

// ─── Entry Point ──────────────────────────────────────────────────────────────

@main
struct NotesWidget: Widget {
    let kind = "NotesWidget"

    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: NotesProvider()) { entry in
            NotesWidgetView(entry: entry)
        }
        .configurationDisplayName("Notes")
        .description("Your latest notes, right on your home screen.")
        .supportedFamilies([.systemSmall, .systemMedium])
    }
}
