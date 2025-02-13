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
    hour12: false,
    timeZone: "Asia/Jakarta",
  });
};

const DetailSiswa = () => {
  const { id, nama, kelas } = useParams<{ id: string; nama: string; kelas: string }>();
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
      navigate("/");
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
      <p className="text-lg">Kelas: {kelas}</p>

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

      <h2 className="text-2xl font-bold mt-4">Absensi Fingerprint (dummy)</h2>
      <p className="text-lg">Fitur belum tersedia</p>
      {/* <table className="w-full border-collapse border border-gray-300 mt-4">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-gray-300 p-2">Waktu</th>
            <th className="border border-gray-300 p-2">Status</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border border-gray-300 p-2">Rabu, 12 Februari 2025</td>
            <td className="border border-gray-300 p-2 bg-green-500 text-white">Sudah Scan</td>
          </tr>
          <tr>
            <td className="border border-gray-300 p-2">Kamis, 13 Februari 2025</td>
            <td className="border border-gray-300 p-2 bg-red-500 text-white">Belum Scan</td>
          </tr>
        </tbody>
      </table> */}
    </div>
  );
};

export default DetailSiswa;
