// import { useEffect, useState } from "react";
// import { useParams, useSearchParams } from "react-router-dom";

// import Editor from "../../components/Editor/Editor";
// import Header from "../../components/Header/Header";
// import Sidebar from "../../components/Sidebar/Sidebar";
// import { getDocumentById, updateDocument } from "../../utils/storage";

// import "./Edit.css";

// function Edit() {
//   const { id } = useParams();
//   const [searchParams] = useSearchParams();

//   const [content, setContent] = useState("");
//   const [isEditing, setIsEditing] = useState(false);

//   // load document
//   useEffect(() => {
//     if (!id) return;

//     const doc = getDocumentById(id);
//     if (!doc) return;

//     setContent(doc.content);

//     // edit mode
//     const mode = searchParams.get("mode");
//     if (mode === "edit") {
//       setIsEditing(true);
//     } else {
//       navigate(`/view/${doc.id}`);
//     }
//   }, [id, searchParams]);

//   // AUTOSAVE
//   useEffect(() => {
//     if (!id || !isEditing) return;

//     const timeout = setTimeout(() => {
//       updateDocument(id, {
//         content,
//         updatedAt: new Date().toLocaleString(),
//         readOnly: false,
//       });
//     }, 800);

//     return () => clearTimeout(timeout);
//   }, [content, id, isEditing]);

//   return (
//     <div className="app-layout">
//       <Sidebar />

//       <div className="main-area">
//         <Header
//           isEditing={isEditing}
//           onToggleEdit={() => {
//             setIsEditing((prev) => !prev);
//           }}
//         />

//         <Editor value={content} onChange={setContent} isEditing={isEditing} />
//       </div>
//     </div>
//   );
// }

// export default Edit;
import { useEffect, useState } from "react";
import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";

import Editor from "../../components/Editor/Editor";
import Header from "../../components/Header/Header";
import Sidebar from "../../components/Sidebar/Sidebar";
import { getDocumentById, updateDocument } from "../../utils/storage";

import "./Edit.css";

function Edit() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [wordCount, setWordCount] = useState(0);

  const [content, setContent] = useState("");

  // 🔥 ROUTE decides mode
  const isEditRoute = location.pathname.startsWith("/edit");
  const modeParam = searchParams.get("mode");

  const isEditing = isEditRoute || modeParam === "edit";

  // Load document
  useEffect(() => {
    if (!id) return;

    const doc = getDocumentById(id);
    if (!doc) return;

    setContent(doc.content);

    // 🧠 safety: agar direct /edit pe aaye but readOnly doc hai
    if (isEditRoute && doc.readOnly) {
      navigate(`/view/${id}`, { replace: true });
    }
  }, [id, isEditRoute, navigate]);
  useEffect(() => {
    if (!content) {
      setWordCount(0);
      return;
    }

    // strip HTML tags
    const text = content.replace(/<[^>]*>/g, "").trim();

    const words = text.split(/\s+/).filter(Boolean);

    setWordCount(words.length);
  }, [content]);

  // AUTOSAVE (only in edit mode)
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

  // Header toggle → ROUTE CHANGE
  const handleToggleEdit = () => {
    if (!id) return;

    if (isEditing) {
      navigate(`/view/${id}`);
    } else {
      navigate(`/edit/${id}?mode=edit`);
    }
  };

  return (
    <div className="app-layout">
      <Sidebar />

      <div className="main-area">
        <Header
          isEditing={isEditing}
          wordCount={wordCount}
          onToggleEdit={handleToggleEdit}
        />

        <Editor value={content} onChange={setContent} isEditing={isEditing} />
      </div>
    </div>
  );
}

export default Edit;
