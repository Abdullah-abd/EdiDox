import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "./Editor.css";

function Editor({ value, onChange, isEditing }) {
  return (
    <div className="editor-container">
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        readOnly={!isEditing}
        modules={{
          toolbar: {
            container: "#editor-toolbar",
          },
        }}
      />
    </div>
  );
}

export default Editor;
