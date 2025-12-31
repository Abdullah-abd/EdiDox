import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import Edit from "./pages/Edit/Edit";
import Upload from "./pages/Upload/Upload";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* MAIN APP LAYOUT */}
        <Route path="/" element={<Edit />}>
          {/* Home → just layout, no doc */}
          <Route index element={null} />

          {/* Edit document */}
          <Route path="edit/:id" element={null} />
        </Route>

        {/* Upload page */}
        <Route path="/upload" element={<Upload />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
