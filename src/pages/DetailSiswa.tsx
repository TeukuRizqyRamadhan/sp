import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/api";

type SP = {
  id: string;
  jenisPelanggaran: string;
  keterangan: string;
  tanggal: string;
};

const formatTanggal = (tanggal: string) => {
  return new Date(tanggal).toLocaleString("id-ID", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false, // Gunakan format 24 jam
    timeZone: "Asia/Jakarta", // Pastikan sesuai zona waktu
  });
};

const DetailSiswa = () => {
  const { id, nama } = useParams<{ id: string; nama: string }>();
  const [spList, setSpList] = useState<SP[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDetailSP = async () => {
      try {
        const { data } = await API.get<SP[]>(`/siswa/${id}/detail-sp`);
        setSpList(data);
      } catch (error) {
        console.error("Error fetching SP:", error);
      }
    };
    fetchDetailSP();
  }, [id]);

  const checkToken = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/"); // Redirect ke halaman login jika tidak ada token
    }
  };

  useEffect(() => {
    checkToken();
  }, []);

  return (
    <div className="p-6">
      <button
        onClick={() => navigate(-1)}
        className="bg-gray-500 text-white px-4 py-2 rounded"
        onMouseEnter={(e) =>
          ((e.target as HTMLButtonElement).style.cursor = "pointer")
        }
      >
        Kembali
      </button>
      <h2 className="text-2xl font-bold mt-4">Detail Surat Pembinaan</h2>
      <p className="text-lg">Nama: {nama}</p>

      {spList.length > 0 ? (
        <table className="w-full border-collapse border border-gray-300 mt-4">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 p-2">Tanggal</th>
              <th className="border border-gray-300 p-2">Jenis Pelanggaran</th>
              <th className="border border-gray-300 p-2">Keterangan</th>
            </tr>
          </thead>
          <tbody>
            {spList.map((sp) => (
              <tr key={sp.id}>
                {/* buat tanggal format seperti 02 - desember - 2023 */}
                <td className="border border-gray-300 p-2">
                  {formatTanggal(sp.tanggal)}
                </td>
                <td className="border border-gray-300 p-2">
                  {sp.jenisPelanggaran}
                </td>
                <td className="border border-gray-300 p-2">{sp.keterangan}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="mt-4 text-gray-500">Belum ada Surat Pembinaan.</p>
      )}
    </div>
  );
};

export default DetailSiswa;
