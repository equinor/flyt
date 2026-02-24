// Example pattern (pseudo-ish), integrating with y-websocket internal doc map
import * as Y from "yjs";

// Suppose you maintain a map of docs keyed by room
const docs = new Map();

export function getDoc(room: any) {
  let doc = docs.get(room);
  if (!doc) {
    doc = new Y.Doc();
    docs.set(room, doc);
  }
  return docs.get(room);
}
