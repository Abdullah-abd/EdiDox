import "react-quill/dist/quill.snow.css";
import "./Header.css";

function Header({ isEditing, onToggleEdit }) {
  return (
    <header className="editor-header">
      {/* Toolbar */}
      <div
        id="editor-toolbar"
        className={`toolbar-left ql-toolbar ql-snow ${
          !isEditing ? "toolbar-disabled" : ""
        }`}
      >
        <select className="ql-header">
          <option value="1">H1</option>
          <option value="2">H2</option>
          <option value="">Normal</option>
        </select>

        <button className="ql-bold" />
        <button className="ql-italic" />
        <button className="ql-underline" />

        <button className="ql-list" value="ordered" />
        <button className="ql-list" value="bullet" />
      </div>

      {/* Action */}
      <div className="toolbar-right">
        <button className="edit-toggle-btn" onClick={onToggleEdit}>
          {isEditing ? "Disable Edit" : "Enable Edit"}
        </button>
      </div>
    </header>
  );
}

export default Header;
