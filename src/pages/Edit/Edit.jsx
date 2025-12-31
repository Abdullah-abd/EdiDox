import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";

import Editor from "../../components/Editor/Editor";
import Header from "../../components/Header/Header";
import Sidebar from "../../components/Sidebar/Sidebar";
import { getDocumentById, updateDocument } from "../../utils/storage";

import "./Edit.css";

function Edit() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();

  const [content, setContent] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  // load document
  useEffect(() => {
    if (!id) return;

    const doc = getDocumentById(id);
    if (!doc) return;

    setContent(doc.content);

    // edit mode
    const mode = searchParams.get("mode");
    if (mode === "edit") {
      setIsEditing(true);
    } else {
      setIsEditing(!doc.readOnly);
    }
  }, [id, searchParams]);

  // AUTOSAVE
  useEffect(() => {
    if (!id || !isEditing) return;

    const timeout = setTimeout(() => {
      updateDocument(id, {
        content,
        updatedAt: new Date().toLocaleString(),
        readOnly: false,
      });
    }, 800);

    return () => clearTimeout(timeout);
  }, [content, id, isEditing]);

  return (
    <div className="app-layout">
      <Sidebar />

      <div className="main-area">
        <Header
          isEditing={isEditing}
          onToggleEdit={() => setIsEditing((prev) => !prev)}
        />

        <Editor value={content} onChange={setContent} isEditing={isEditing} />
      </div>
    </div>
  );
}

export default Edit;
