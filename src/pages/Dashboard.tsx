import { useEffect, useState } from "react";
import API from "../api/api";
import { Link, useNavigate } from "react-router-dom";

// Definisi tipe data siswa
type Siswa = {
  id: string;
  nama: string;
};

// Definisi tipe data ringkasan
type StatistikSP = {
  totalSiswa: number;
  totalSiswaKenaSP: number;
  siswaTerbanyakSP: { nama: string; jumlahSP: number } | null;
};

const Dashboard = () => {
  const [nama, setNama] = useState("");
  const [hasil, setHasil] = useState<Siswa[]>([]);
  const [selectedSiswa, setSelectedSiswa] = useState<Siswa | null>(null);
  const [keterangan, setKeterangan] = useState("");
  const [statistik, setStatistik] = useState<StatistikSP | null>(null);

  const navigate = useNavigate();

  // Ambil data statistik SP saat halaman dimuat
  useEffect(() => {
    const fetchStatistik = async () => {
      try {
        const { data } = await API.get<StatistikSP>("/siswa/statistik-sp");
        setStatistik(data);
      } catch (error) {
        console.error("Gagal mengambil data statistik:", error);
      }
    };
    fetchStatistik();
  }, []);

  const cariSiswa = async () => {
    try {
      const { data } = await API.get<Siswa[]>(`/siswa/search?nama=${nama}`);
      setHasil(data);
    } catch (error) {
      console.error("Error fetching siswa:", error);
    }
  };

  const buatSP = async () => {
    if (!selectedSiswa) return;
    try {
      await API.post("/siswa/sp", {
        siswaId: selectedSiswa.id,
        keterangan,
      });
      alert("Surat Pembinaan berhasil dibuat!");
      window.location.reload(); // Refresh untuk update statistik
    } catch (error) {
      console.error("Error membuat SP:", error);
    }
  };

  const cekSP = () => {
    if (!selectedSiswa) return;
    navigate(`detail-siswa/${selectedSiswa.id}/${selectedSiswa.nama}`);
  };

  const logout = () => {
    localStorage.removeItem("token"); // Hapus sesi pengguna
    navigate("/"); // Redirect ke halaman login
  };

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
      {/* Header Dashboard */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Dashboard</h2>
        <button
          className="bg-gray-700 text-white px-4 py-2 rounded"
          onClick={logout}
        >
          Logout
        </button>
      </div>
      {/* Ringkasan Statistik SP */}
      {statistik && (
        <div className="mb-6">
          <h3 className="text-xl font-bold">Ringkasan Surat Pembinaan</h3>
          <table className="w-full border-collapse border border-gray-300 mt-2">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-300 p-2">Total Siswa</th>
                <th className="border border-gray-300 p-2">
                  Total Siswa Kena SP
                </th>
                <th className="border border-gray-300 p-2">
                  Siswa Terbanyak SP
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="text-center">
                <td className="border border-gray-300 p-2">
                  {statistik.totalSiswa}
                </td>
                <td className="border border-gray-300 p-2">
                  {statistik.totalSiswaKenaSP}
                </td>
                <td className="border border-gray-300 p-2">
                  {statistik.siswaTerbanyakSP
                    ? `${statistik.siswaTerbanyakSP.nama} (${statistik.siswaTerbanyakSP.jumlahSP} SP)`
                    : "Belum ada"}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
      {/* Pencarian Siswa */}
      <h3 className="text-xl font-bold">Cari Siswa</h3>
      <input
        type="text"
        className="border p-2 mr-2"
        placeholder="Nama siswa..."
        value={nama}
        onChange={(e) => setNama(e.target.value)}
      />
      <button className="bg-blue-500 text-white px-4 py-2" onClick={cariSiswa}>
        Cari
      </button>
      <button className="bg-green-500 text-white px-4 py-2 mt-2 md:ml-2">
        <Link to="upload-siswa">Tambah Siswa</Link>
      </button>
      {/* Hasil Pencarian */}
      {hasil.length > 0 && (
        <div className="mt-4">
          <h3 className="text-lg font-bold">Hasil Pencarian</h3>
          <ul className="space-y-2">
            {hasil.map((siswa) => (
              <li
                key={siswa.id}
                className="border p-3 rounded-lg cursor-pointer hover:bg-blue-100 hover:shadow-md transition-all duration-200"
                onClick={() => setSelectedSiswa(siswa)}
              >
                <span className="text-gray-800 font-semibold">
                  {siswa.nama}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
      {/* Form Pembuatan SP */}
      {selectedSiswa && (
        <div className="mt-4">
          <h3 className="text-lg font-bold">Buat Surat Pembinaan</h3>
          <input
            type="text"
            className="border p-2 w-full"
            placeholder="Keterangan..."
            value={keterangan}
            onChange={(e) => setKeterangan(e.target.value)}
          />
          <button
            className="bg-red-500 text-white p-2 mt-2 w-full"
            onClick={buatSP}
          >
            Buat SP
          </button>
          <button
            className="bg-gray-500 text-white p-2 mt-2 w-full"
            onClick={cekSP}
          >
            Cek Jumlah SP
          </button>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
