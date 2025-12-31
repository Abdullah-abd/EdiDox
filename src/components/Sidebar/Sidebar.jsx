import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { deleteDocument, getDocuments } from "../../utils/storage";
import "./Sidebar.css";

function Sidebar() {
  const navigate = useNavigate();
  const [documents, setDocuments] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    setDocuments(getDocuments());
  }, []);

  const handleDelete = (id) => {
    deleteDocument(id);
    setDocuments(getDocuments());
  };

  const filteredDocs = documents.filter((doc) =>
    doc.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <aside className="sidebar">
      <div className="sidebar-top">
        <button className="new-doc-btn" onClick={() => navigate("/upload")}>
          ➕ New Document
        </button>

        <input
          type="text"
          placeholder="Search documents"
          className="search-input"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="doc-list">
        {filteredDocs.length === 0 ? (
          <p className="empty-text">No documents found</p>
        ) : (
          filteredDocs.map((doc) => (
            <div key={doc.id} className="doc-item">
              <div
                className="doc-info"
                onClick={() => navigate(`/view/${doc.id}`)}
              >
                <p className="doc-title">{doc.title}</p>
                <span className="doc-date">{doc.updatedAt}</span>
              </div>

              <div className="doc-actions">
                {/* EDIT BUTTON */}
                <button
                  className="doc-edit-btn"
                  title="Edit document"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/edit/${doc.id}?mode=edit`);
                  }}
                >
                  ✏️
                </button>

                {/* DELETE BUTTON */}
                <button
                  className="doc-delete-btn"
                  title="Delete document"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(doc.id);
                  }}
                >
                  🗑️
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </aside>
  );
}

export default Sidebar;
