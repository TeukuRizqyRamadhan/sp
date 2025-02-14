import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ExportData = () => {
  const navigate = useNavigate();
  const checkToken = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
    }
  };

  useEffect(() => {
    checkToken();
  }, []);
  return (
    <div className="p-4 border rounded">
      <h2 className="text-xl font-bold">Export Data Surat Pembinaan</h2>
      <p className="text-gray-600 mt-2">
        Silahkan Pilih Rentang Tanggal / Bulan / Tahun{" "}
      </p>
      <button className="bg-blue-500 text-white px-4 py-2 mt-2">
        Export Data
      </button>
    </div>
  );
};

export default ExportData;
