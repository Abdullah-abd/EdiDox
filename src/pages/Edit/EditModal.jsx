import React, { useState, useEffect } from "react";
import Editor from "../../components/Editor/Editor";
import Header from "../../components/Header/Header";
import "./EditModal.css";
import { Document, Page, pdfjs } from "react-pdf";
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
function EditModal({
  isOpen,
  setIsOpen,
  extension,
  isEditing,
  wordCount,
  onToggleEdit,
  onExport,
  content,
  setContent,
  pdfUrl,
}) {
  if (!isOpen) return null;
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.0);
  const [rotation, setRotation] = useState(0);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };
  //scroll to page function
  useEffect(() => {
    if (extension !== "pdf" || !numPages) return; // Logic tabhi chale jab PDF load ho

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const attr = entry.target.getAttribute("data-pagenumber");
            if (attr) {
              const p = parseInt(attr, 10);
              if (!isNaN(p)) {
                setPageNumber(p);
              }
            }
          }
        });
      },
      {
        threshold: 0.6,
        root: document.querySelector(".editor-container"),
      },
    );

    const pages = document.querySelectorAll(".pdf-page-spacing");
    pages.forEach((page) => observer.observe(page));

    return () => observer.disconnect();
  }, [numPages, extension, scale]);
  const scrollToPage = (p) => {
    const pageElement = document.getElementById(`page_${p}`);
    if (pageElement) {
      pageElement.scrollIntoView({ behavior: "smooth", block: "start" });
      setPageNumber(p);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="main-area">
          {/* {extension !== "pdf" && ( */}
          <div className="document-header">
            <Header
              isEditing={isEditing}
              wordCount={wordCount}
              onToggleEdit={onToggleEdit}
              onExport={onExport}
              setIsOpen={setIsOpen}
              extension={extension}
              currentPage={pageNumber}
              totalPages={numPages}
              onZoomIn={() => setScale((s) => Math.min(s + 0.1, 2.0))}
              onZoomOut={() => setScale((s) => Math.max(s - 0.1, 0.5))}
              onRotate={() => setRotation((r) => (r + 90) % 360)}
              onNextPage={() => {
                if (pageNumber < numPages) scrollToPage(pageNumber + 1);
              }}
              onPrevPage={() => {
                if (pageNumber > 1) scrollToPage(pageNumber - 1);
              }}
              setPage={scrollToPage}
            />
          </div>
          {/* )} */}

          <div className="editor-container">
            {extension === "pdf" ? (
              <div
                className="pdf-viewer-container"
                style={{
                  transform: `rotate(${rotation}deg)`,
                  transition: "transform 0.3s",
                }}
              >
                {/* This button overlays the native toolbar */}
                <Document
                  file={pdfUrl}
                  onLoadSuccess={onDocumentLoadSuccess}
                  loading={<p style={{ color: "white" }}>Loading PDF...</p>}
                >
                  {numPages &&
                    Array.from(new Array(numPages), (el, index) => (
                      <div
                        key={`page_container_${index + 1}`}
                        id={`page_${index + 1}`} // Wrapper par ID di taaki scroll yahan ho
                        className="pdf-page-spacing" // Observer isi class ko dekh raha hai
                        data-pagenumber={index + 1}
                        style={{ marginBottom: "20px" }} // Taaki separation dikhe
                      >
                        <Page
                          pageNumber={index + 1}
                          scale={scale}
                          rotate={rotation}
                          renderTextLayer={false}
                          renderAnnotationLayer={false}
                        />
                      </div>
                    ))}
                </Document>
              </div>
            ) : (
              <div className="editor-wrapper">
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
    </div>
  );
}

export default EditModal;
