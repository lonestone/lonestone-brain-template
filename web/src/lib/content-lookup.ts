// Ties a content collection entry back to the wiki page it came from.
//
// The glob loader slugifies collection ids, so `Note de cadrage.mdx` is loaded under
// `note-de-cadrage`. The file path is what survives that, and it is what a renderer has
// in hand: its page id is the repo path of the same file.

interface LoadedEntry {
  filePath?: string;
}

/** Wiki page id of a collection entry, from the file it was loaded from. */
export function entryPageId(entry: LoadedEntry): string {
  return (entry.filePath ?? "").replace(/^(?:\.\.\/)+/, "").replace(/\.(md|mdx)$/i, "");
}

/** The entry loaded from a given wiki page, if the collection holds it. */
export function entryForPage<T extends LoadedEntry>(entries: T[], id: string): T | undefined {
  return entries.find((entry) => entryPageId(entry) === id);
}
