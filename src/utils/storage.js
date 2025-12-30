const STORAGE_KEY = "documents";

export function getDocuments() {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

export function saveDocument(doc) {
  const docs = getDocuments();
  localStorage.setItem(STORAGE_KEY, JSON.stringify([doc, ...docs]));
}

export function getDocumentById(id) {
  const docs = getDocuments();
  return docs.find((doc) => doc.id === id);
}

export function deleteDocument(id) {
  const docs = getDocuments().filter((doc) => doc.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(docs));
}

export function updateDocument(id, updates) {
  const docs = getDocuments();

  const updatedDocs = docs.map((doc) =>
    doc.id === id
      ? {
          ...doc,
          ...updates,
          updatedAt: new Date().toLocaleString(), // ✅ time + date
        }
      : doc
  );

  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedDocs));
}
