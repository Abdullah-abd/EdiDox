import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import Editor from "../../components/Editor/Editor";
import Header from "../../components/Header/Header";
import Sidebar from "../../components/Sidebar/Sidebar";
import {
  getDocumentById,
  updateDocument,
  getDocumentExtension,
} from "../../utils/storage";

import "./Edit.css";

function Edit() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [content, setContent] = useState("");
  const [wordCount, setWordCount] = useState(0);
  const [extension, setExtension] = useState("txt");
  const [pdfUrl, setPdfUrl] = useState("");
  // 🔥 ROUTE = MODE
  const isEditing = location.pathname.startsWith("/edit");

  // Load document
  useEffect(() => {
    if (!id) return;

    const doc = getDocumentById(id);
    if (!doc) return;

    setContent(doc.content);
    setExtension(doc.extension || "docx");
  }, [id]);

  // Word count
  useEffect(() => {
    if (extension === "pdf") {
      setWordCount(0);
      return;
    }
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
//pdf blob conversion
useEffect(() => {
  if (extension !== "pdf" || !content) return;

  try {
    const cleanBase64 = content.replace(/<[^>]*>/g, "").trim();
    const base64Parts = cleanBase64.split(",");
    const base64String = base64Parts[1] || base64Parts[0];

    const byteCharacters = atob(base64String);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: "application/pdf" });
    
    const url = URL.createObjectURL(blob);
    setPdfUrl(url);

    return () => {
      if (url) URL.revokeObjectURL(url);
    };
  } catch (err) {
    console.error("Conversion failed", err);
  }
}, [content, extension]);
  // Header toggle → route change
  const handleToggleEdit = () => {
    if (!id) return;

    if (isEditing) {
      navigate(`/view/${id}`);
    } else {
      navigate(`/edit/${id}`);
    }
  };
  //exporting as txt (stripping HTML) or as pdf (original content)
  const onExport = () => {
    const element = document.createElement("a");
    const file = new Blob([content.replace(/<[^>]*>/g, "\n")], {
      type: "text/plain",
    });
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
        {extension !== "pdf" && (
          <div className="document-header">
            <Header
              isEditing={isEditing}
              wordCount={wordCount}
              onToggleEdit={handleToggleEdit}
              onExport={onExport}
          />
        </div>)}
        
        <div className="editor-container">
          {extension === "pdf" ? (
            <div className="pdf-viewer-container">
              <embed
                src={pdfUrl}
                type="application/pdf"
                width="100%"
                height="100%"
                style={{ border: "none" }}
              />
            </div>
          ) : (
            <div style={{ padding: "30px 100px", width: "100%" }}>
              <Editor
                value={content}
                onChange={setContent}
                isEditing={isEditing}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Edit;
