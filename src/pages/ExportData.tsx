import { useState } from "react";
import API from "../api/api";
import Swal from "sweetalert2";

const ExportData = ({ onClose }: { onClose: () => void }) => {
  const [filter, setFilter] = useState("hari");
  const [date, setDate] = useState("");

  const handleExport = async () => {
    try {
      const response = await API.get(`/siswa/export-sp`, {
        params: { filter, date },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `data-${filter}-${date}.csv`);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);

      // Menampilkan SweetAlert sukses
      Swal.fire("Sukses!", "Data berhasil diekspor!", "success");

      onClose(); // Tutup modal setelah ekspor berhasil
    } catch (error) {
      console.error("Error exporting data:", error);

      // Menampilkan SweetAlert gagal
      Swal.fire("Gagal!", "Terjadi kesalahan saat mengekspor data.", "error");
    }
  };

  const handleExportExcel = async () => {
    try {
      const response = await API.get(`/siswa/export-excel`, {
        params: { filter, date },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `data-${filter}-${date}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);

      Swal.fire("Sukses!", "Data berhasil diekspor ke Excel!", "success");
      onClose(); // Tutup modal setelah ekspor berhasil
    } catch (error) {
      console.error("Error exporting data to Excel:", error);
      Swal.fire("Gagal!", "Terjadi kesalahan saat mengekspor data ke Excel.", "error");
    }
  };

  const generateYears = () => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: currentYear - 1999 }, (_, i) => currentYear - i);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg w-full max-w-md">
      <h2 className="text-xl font-bold mb-2">Export Data Surat Pembinaan</h2>
      <p className="text-gray-600 mb-4">Silahkan Pilih Rentang Waktu</p>

      <select
        className="border p-2 w-full"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      >
        <option value="hari">Per Hari</option>
        <option value="bulan">Per Bulan</option>
        <option value="tahun">Per Tahun</option>
      </select>

      {filter === "hari" && (
        <input
          type="date"
          className="border p-2 w-full mt-2"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      )}

      {filter === "bulan" && (
        <input
          type="month"
          className="border p-2 w-full mt-2"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      )}

      {filter === "tahun" && (
        <select
          className="border p-2 w-full mt-2"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        >
          <option value="">Pilih Tahun</option>
          {generateYears().map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      )}

      <div className="flex justify-end mt-4">
        <button
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
          onClick={onClose}
          onMouseEnter={(e) =>
          ((e.target as HTMLButtonElement).style.cursor =
            "pointer")
          }
        >
          Tutup
        </button>
        <button
          onClick={handleExport}
          className="bg-blue-500 text-white px-4 py-2 ml-2 rounded hover:bg-blue-600 transition"
          onMouseEnter={(e) =>
          ((e.target as HTMLButtonElement).style.cursor =
            "pointer")
          }
        >
          Export CSV
        </button>
        <button
          onClick={handleExportExcel}
          className="bg-green-500 text-white px-4 py-2 ml-2 rounded hover:bg-green-600 transition"
          onMouseEnter={(e) =>
          ((e.target as HTMLButtonElement).style.cursor =
            "pointer")
          }
        >
          Export Excel
        </button>
      </div>
    </div>
  );
};

export default ExportData;
