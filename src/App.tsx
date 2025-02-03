import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import DetailSiswa from "./pages/DetailSiswa";
import Login from "./pages/Login";
import UploadSiswa from "./pages/UploadSiswa";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route
          path="/dashboard/detail-siswa/:id/:nama"
          element={<DetailSiswa />}
        />
        <Route path="dashboard/upload-siswa" element={<UploadSiswa />} />
      </Routes>
    </Router>
  );
}

export default App;
