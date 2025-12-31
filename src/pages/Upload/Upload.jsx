import mammoth from "mammoth";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { saveDocument } from "../../utils/storage";
import "./Upload.css";

function Upload() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [fileName, setFileName] = useState("");

  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // reset state
    setError("");
    setFileName(file.name);

    // Extension validation
    const extension = file.name.split(".").pop().toLowerCase();
    if (extension !== "docx") {
      setError("Invalid file type. Please upload a .docx file");
      return;
    }

    // MIME type validation (extra safety)
    const validMime =
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

    if (file.type && file.type !== validMime) {
      setError("Invalid DOCX file");
      return;
    }

    // Empty file validation
    if (file.size === 0) {
      setError("File is empty");
      return;
    }

    try {
      const arrayBuffer = await file.arrayBuffer();

      // Spacing-friendly DOCX → HTML
      const result = await mammoth.convertToHtml(
        { arrayBuffer },
        {
          styleMap: [
            "p[style-name='Normal'] => p:fresh",
            "p[style-name='Heading 1'] => h1:fresh",
            "p[style-name='Heading 2'] => h2:fresh",
            "p => p:fresh",
          ],
          includeDefaultStyleMap: true,
          preserveEmptyParagraphs: true,
        }
      );

      const doc = {
        id: crypto.randomUUID(),
        title: file.name.replace(".docx", ""),
        updatedAt: new Date().toLocaleString(),
        content: result.value,
        readOnly: true,
      };

      saveDocument(doc);
      navigate(`/edit/${doc.id}`);
    } catch (err) {
      console.error(err);
      setError("Failed to read DOCX file");
    }
  };

  return (
    <div className="upload-page">
      <div className="upload-card">
        <h2 className="upload-title">Upload Document</h2>
        <p className="upload-subtitle">Upload a DOCX file to view or edit</p>

        {/* Custom upload box */}
        <label className="upload-box">
          <input type="file" accept=".docx" onChange={handleFile} hidden />

          <span className="upload-btn">Choose DOCX File</span>
          <span className="upload-filename">
            {fileName || "No file chosen"}
          </span>
        </label>

        {error && <p className="upload-error">{error}</p>}
      </div>
    </div>
  );
}

export default Upload;
