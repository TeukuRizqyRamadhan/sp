import { useState } from "react";
import Papa from "papaparse";
import { useNavigate } from "react-router-dom";
import { useDropzone } from "react-dropzone";
import API from "../api/api";
import { UploadCloud, FileText, ArrowLeft, Loader2 } from "lucide-react";
import { useEffect } from "react";

type Siswa = {
  nama: string;
  kelas: string;
};

const UploadSiswa = () => {
  const [dataSiswa, setDataSiswa] = useState<Siswa[]>([]);
  const [fileName, setFileName] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
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

  // Handle file upload melalui dropzone
  const onDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setFileName(file.name);

    Papa.parse<Siswa>(file, {
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        const parsedData = result.data.filter((row) => row.nama && row.kelas);
        setDataSiswa(parsedData);
      },
      error: (error) => {
        alert("Gagal membaca file. Pastikan format CSV benar.");
        console.error("Parsing error:", error);
      },
    });
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { "text/csv": [".csv"] },
    multiple: false,
  });

  // Handle upload ke backend
  const handleUpload = async () => {
    if (dataSiswa.length === 0) {
      alert("Tidak ada data yang valid untuk diunggah.");
      return;
    }

    setLoading(true);
    try {
      await API.post("/siswa/upload-massal", { data: dataSiswa });
      alert("Data siswa berhasil diunggah!");
      setDataSiswa([]);
      setFileName("");
    } catch (error) {
      console.error("Error uploading data:", error);
      alert("Gagal mengunggah data siswa.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Upload Massal Siswa</h2>
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          onMouseEnter={(e) => (e.target as HTMLButtonElement).style.cursor = "pointer"}
        >
          <ArrowLeft size={18} /> Kembali
        </button>
      </div>

      {/* Dropzone */}
      <div
        {...getRootProps()}
        className="border-2 border-dashed border-gray-400 p-6 text-center cursor-pointer rounded-lg bg-gray-50 hover:bg-gray-100"
      >
        <input {...getInputProps()} />
        <UploadCloud size={40} className="text-gray-600 mx-auto mb-2" />
        <p className="text-gray-700 font-medium">
          Seret & Letakkan file CSV di sini
        </p>
        <p className="text-gray-500 text-sm">atau klik untuk memilih file</p>
      </div>
      {/* Download File dummy disini */}
      <a
        href="/src/assets/TEST.csv"
        className="flex items-center gap-2 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 mt-4"
      >
        <UploadCloud size={18} /> Download File Dummy
      </a>

      {/* Nama File */}
      {fileName && (
        <div className="flex items-center mt-4 bg-blue-100 text-blue-700 p-3 rounded-lg">
          <FileText size={20} className="mr-2" />
          <span>{fileName}</span>
        </div>
      )}

      {/* Preview Data */}
      {dataSiswa.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Preview Data:</h3>
          <div className="max-h-60 overflow-auto border rounded-md">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-200 text-gray-700">
                  <th className="border p-2">Nama</th>
                  <th className="border p-2">Kelas</th>
                </tr>
              </thead>
              <tbody>
                {dataSiswa.map((siswa, index) => (
                  <tr key={index} className="text-center">
                    <td className="border p-2">{siswa.nama}</td>
                    <td className="border p-2">{siswa.kelas}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Tombol Upload */}
          <button
            onClick={handleUpload}
            disabled={loading}
            className={`${loading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"
              } text-white px-6 py-2 rounded mt-4 block w-full text-center flex justify-center items-center gap-2`}
          >
            {loading && <Loader2 size={18} className="animate-spin" />} Upload
            ke Database
          </button>
        </div>
      )}
    </div>
  );
};

export default UploadSiswa;
