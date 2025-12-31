import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Edit from "./pages/Edit/Edit";
import Upload from "./pages/Upload/Upload";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Layout + Editor */}
        <Route path="/" element={<Edit />}>
          <Route path="edit/:id" element={null} />
          <Route path="view/:id" element={null} />
        </Route>

        <Route path="/upload" element={<Upload />} />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
