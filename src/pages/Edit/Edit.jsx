import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import Editor from "../../components/Editor/Editor";
import Header from "../../components/Header/Header";
import Sidebar from "../../components/Sidebar/Sidebar";
import { getDocumentById, updateDocument } from "../../utils/storage";

import "./Edit.css";

function Edit() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [content, setContent] = useState("");
  const [wordCount, setWordCount] = useState(0);

  // 🔥 ROUTE = MODE
  const isEditing = location.pathname.startsWith("/edit");

  // Load document
  useEffect(() => {
    if (!id) return;

    const doc = getDocumentById(id);
    if (!doc) return;

    setContent(doc.content);
  }, [id]);

  // Word count
  useEffect(() => {
    const text = content.replace(/<[^>]*>/g, "").trim();
    const words = text ? text.split(/\s+/).length : 0;
    setWordCount(words);
  }, [content]);

  //  Autosave (only in edit mode)
  useEffect(() => {
    if (!id || !isEditing) return;

    const timer = setTimeout(() => {
      updateDocument(id, {
        content,
        updatedAt: new Date().toLocaleString(),
        readOnly: false,
      });
    }, 800);

    return () => clearTimeout(timer);
  }, [content, id, isEditing]);

  // Header toggle → route change
  const handleToggleEdit = () => {
    if (!id) return;

    if (isEditing) {
      navigate(`/view/${id}`);
    } else {
      navigate(`/edit/${id}`);
    }
  }; 
  const onExport = () => {
    const element = document.createElement("a");
    const file = new Blob([content.replace(/<[^>]*>/g, "\n")], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `document-${id}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    URL.revokeObjectURL(element.href);
  };
  return (
    <div className="app-layout">
      <Sidebar />

      <div className="main-area">
        <Header
          isEditing={isEditing}
          wordCount={wordCount}
          onToggleEdit={handleToggleEdit}
          onExport={onExport}
        />

        <Editor value={content} onChange={setContent} isEditing={isEditing} />
      </div>
    </div>
  );
}

export default Edit;
