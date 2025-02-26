import { useEffect, useState } from "react";
import API from "../api/api";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import ExportDataModal from "./ExportDataModal";

type Siswa = {
  id: string;
  nama: string;
  kelas: string;
};

type StatistikSP = {
  totalSiswa: number;
  totalSiswaKenaSP: number;
  siswaTerbanyakSP: { nama: string; jumlahSP: number; kelas: string } | null;
};

type Leaderboard = {
  nama: string;
  spCount: number;
  kelas: string;
};

const Dashboard = () => {
  const [nama, setNama] = useState("");
  const [hasil, setHasil] = useState<Siswa[]>([]);
  const [selectedSiswa, setSelectedSiswa] = useState<Siswa | null>(null);
  const [keterangan, setKeterangan] = useState("");
  const [statistik, setStatistik] = useState<StatistikSP | null>(null);
  const [leaderboard, setLeaderboard] = useState<Leaderboard[]>([]);
  const [siswaList, setSiswaList] = useState<Siswa[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();
  const [jenisPelanggaran, setJenisPelanggaran] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    checkToken();
    fetchStatistik();
    fetchLeaderboard();
    fetchSiswa(currentPage);
  }, [currentPage]);

  const checkToken = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
    }
  };

  const fetchStatistik = async () => {
    try {
      const { data } = await API.get<StatistikSP>("/siswa/statistik-sp");
      setStatistik(data);
    } catch (error) {
      console.error("Gagal mengambil data statistik:", error);
    }
  };

  const fetchLeaderboard = async () => {
    try {
      const { data } = await API.get<Leaderboard[]>("/siswa/leaderboard-sp");
      setLeaderboard(data);
    } catch (error) {
      console.error("Gagal mengambil data leaderboard:", error);
    }
  };

  const fetchSiswa = async (page: number) => {
    try {
      const { data } = await API.get(`/siswa?page=${page}&limit=10`);
      setSiswaList(data.siswa);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Gagal mengambil daftar siswa:", error);
    }
  };

  const cariSiswa = async (keyword: string) => {
    setNama(keyword);
    if (keyword.length > 1) {
      try {
        const { data } = await API.get<Siswa[]>(
          `/siswa/search?nama=${keyword}`
        );
        setHasil(data);
      } catch (error) {
        console.error("Error fetching siswa:", error);
      }
    } else {
      setHasil([]);
    }
  };

  const handleBuatSP = () => {
    if (!keterangan.trim()) {
      Swal.fire({
        title: "Peringatan!",
        text: "Keterangan tidak boleh dikosongkan!",
        icon: "warning",
        confirmButtonText: "OK",
      });
      return;
    }

    if (!jenisPelanggaran) {
      Swal.fire({
        title: "Peringatan!",
        text: "Silakan pilih jenis pelanggaran.",
        icon: "warning",
        confirmButtonText: "OK",
      });
      return;
    }
    buatSP();
  };

  const buatSP = async () => {
    if (!selectedSiswa) {
      Swal.fire({
        title: "Peringatan!",
        text: "Silakan pilih siswa terlebih dahulu.",
        icon: "warning",
        confirmButtonText: "OK",
      });
      return;
    }

    if (!keterangan) {
      Swal.fire({
        title: "Peringatan!",
        text: "Silakan isi keterangan SP.",
        icon: "warning",
        confirmButtonText: "OK",
      });
      return;
    }

    try {
      const result = await Swal.fire({
        title: "Konfirmasi",
        text: `Anda yakin ingin membuat Surat Pembinaan untuk ${selectedSiswa.nama}?`,
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Ya, Buat SP",
        cancelButtonText: "Batal",
      });

      if (result.isConfirmed) {
        await API.post("/siswa/sp", {
          siswaId: selectedSiswa.id,
          jenisPelanggaran,
          keterangan,
        });

        Swal.fire({
          title: "Berhasil!",
          text: "Surat Pembinaan berhasil dibuat.",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        }).then(() => {
          window.location.reload();
        });
      }
    } catch (error) {
      console.error("Error membuat SP:", error);
      Swal.fire({
        title: "Terjadi Kesalahan",
        text: "Gagal membuat Surat Pembinaan. Silakan coba lagi.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  const cekSP = () => {
    if (!selectedSiswa) return;
    navigate(
      `detail-siswa/${selectedSiswa.id}/${selectedSiswa.nama}/${selectedSiswa.kelas}`
    );
  };

  const logout = () => {
    Swal.fire({
      title: "Yakin ingin logout?",
      text: "Anda akan keluar dari sesi ini.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya, Logout",
      cancelButtonText: "Batal",
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("token");

        Swal.fire({
          title: "Logout Berhasil!",
          text: "Anda telah keluar.",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        }).then(() => {
          navigate("/");
        });
      }
    });
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Dashboard</h2>
        <button
          className="bg-gray-700 text-white px-4 py-2 rounded"
          onClick={logout}
          onMouseEnter={(e) =>
            ((e.target as HTMLButtonElement).style.cursor = "pointer")
          }
        >
          Logout
        </button>
      </div>

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
                    ? `${statistik.siswaTerbanyakSP.nama} - ${statistik.siswaTerbanyakSP.kelas} (${statistik.siswaTerbanyakSP.jumlahSP} SP)`
                    : "Belum ada"}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {leaderboard?.length > 0 ? (
        <div className="mb-6">
          <h3 className="text-xl font-bold">Top 5 Surat Pembinaan</h3>
          <table className="w-full border-collapse border border-gray-300 mt-2">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-300 p-2">No</th>
                <th className="border border-gray-300 p-2">Nama Siswa</th>
                <th className="border border-gray-300 p-2">Jumlah SP</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((item, index) => (
                <tr key={item?.nama || index} className="text-center">
                  <td className="border border-gray-300 p-2">{index + 1}</td>
                  <td className="border border-gray-300 p-2">
                    {item?.nama ?? "Tidak ada data"} -{" "}
                    {item?.kelas ?? "Tidak ada data"}
                  </td>
                  <td className="border border-gray-300 p-2">
                    {item?.spCount ?? 0}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-gray-500 mt-4">Belum ada data leaderboard SP.</p>
      )}

      <h3 className="text-xl font-bold">Cari Siswa</h3>
      <input
        type="text"
        className="border p-2 w-full"
        placeholder="Nama siswa..."
        value={nama}
        onChange={(e) => cariSiswa(e.target.value)}
      />
      <div className="flex space-x-2">
        <button className="bg-green-500 text-white px-4 py-2 mt-2">
          <Link to="upload-siswa">Tambah Siswa</Link>
        </button>
        <button className="bg-blue-500 text-white px-4 py-2 mt-2">
          <Link to="panduan">Panduan Website</Link>
        </button>
        <button
          className="bg-gray-500 text-white px-4 py-2 mt-2"
          onClick={() => setIsModalOpen(true)}
          onMouseEnter={(e) =>
          ((e.target as HTMLButtonElement).style.cursor =
            "pointer")
          }
        >
          Export Data
        </button>

        {/* Modal akan muncul jika `isModalOpen` true */}
        <ExportDataModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      </div>

      {hasil.length > 0 && (
        <div className="mt-4">
          <h3 className="text-lg font-bold">Hasil Pencarian</h3>
          <ul className="space-y-2">
            {hasil.map((siswa) => (
              <li key={siswa.id}>
                <div
                  className={`border p-3 rounded-lg cursor-pointer transition-all ${selectedSiswa?.id === siswa.id
                    ? "bg-blue-200 text-blue-800"
                    : "hover:bg-blue-100"
                    }`}
                  onClick={() =>
                    setSelectedSiswa(
                      selectedSiswa?.id === siswa.id ? null : siswa
                    )
                  }
                >
                  <span className="text-gray-800 font-semibold">
                    {siswa.nama} - {siswa.kelas}
                  </span>
                </div>

                {selectedSiswa?.id === siswa.id && (
                  <div className="mt-2 p-3 border rounded-lg bg-gray-50">
                    <h3 className="text-lg font-bold">
                      Buat Surat Pembinaan: {siswa.nama} - {siswa.kelas}
                    </h3>
                    <form>
                      <label>Jenis Pelanggaran:</label>
                      <br />
                      <input
                        type="radio"
                        id="keterlambatan"
                        name="jenisPelanggaran"
                        value="Keterlambatan"
                        onChange={(e) => setJenisPelanggaran(e.target.value)}
                      />
                      <label htmlFor="keterlambatan">Keterlambatan</label>
                      <br />

                      <input
                        type="radio"
                        id="ketertiban"
                        name="jenisPelanggaran"
                        value="Ketertiban"
                        onChange={(e) => setJenisPelanggaran(e.target.value)}
                      />
                      <label htmlFor="Ketertiban">Ketertiban</label>
                      <br />

                      <input
                        type="radio"
                        id="penampilan"
                        name="jenisPelanggaran"
                        value="Penampilan"
                        onChange={(e) => setJenisPelanggaran(e.target.value)}
                      />
                      <label htmlFor="Penampilan">Penampilan</label>
                      <br />

                      <p>Jenis Pelanggaran yang dipilih: {jenisPelanggaran}</p>
                    </form>

                    <input
                      type="text"
                      className="border p-2 w-full mt-2"
                      placeholder="Keterangan..."
                      value={keterangan}
                      onChange={(e) => setKeterangan(e.target.value)}
                    />
                    <button
                      className="bg-red-500 text-white p-2 mt-2 w-full"
                      onClick={handleBuatSP}
                      onMouseEnter={(e) =>
                      ((e.target as HTMLButtonElement).style.cursor =
                        "pointer")
                      }
                    >
                      Buat SP
                    </button>
                    <button
                      className="bg-gray-500 text-white p-2 mt-2 w-full"
                      onClick={cekSP}
                      onMouseEnter={(e) =>
                      ((e.target as HTMLButtonElement).style.cursor =
                        "pointer")
                      }
                    >
                      Cek Jumlah SP
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      <h3 className="text-xl font-bold mt-6">Daftar Siswa</h3>
      <ul className="mt-4 space-y-2">
        {siswaList.map((siswa) => (
          <li key={siswa.id}>
            <div
              className={`border p-3 rounded-lg cursor-pointer transition-all ${selectedSiswa?.id === siswa.id
                ? "bg-blue-200 text-blue-800"
                : "hover:bg-gray-100"
                }`}
              onClick={() =>
                setSelectedSiswa(selectedSiswa?.id === siswa.id ? null : siswa)
              }
            >
              {siswa.nama} - {siswa.kelas}
            </div>

            {selectedSiswa?.id === siswa.id && (
              <div className="mt-2 p-3 border rounded-lg bg-gray-50">
                <h3 className="text-lg font-bold">
                  Buat Surat Pembinaan: {siswa.nama} - {siswa.kelas}
                </h3>
                <form>
                  <label>Jenis Pelanggaran:</label>
                  <br />
                  <input
                    type="radio"
                    id="keterlambatan"
                    name="jenisPelanggaran"
                    value="Keterlambatan"
                    onChange={(e) => setJenisPelanggaran(e.target.value)}
                  />
                  <label htmlFor="keterlambatan">Keterlambatan</label>
                  <br />

                  <input
                    type="radio"
                    id="ketertiban"
                    name="jenisPelanggaran"
                    value="Ketertiban"
                    onChange={(e) => setJenisPelanggaran(e.target.value)}
                  />
                  <label htmlFor="Ketertiban">Ketertiban</label>
                  <br />

                  <input
                    type="radio"
                    id="penampilan"
                    name="jenisPelanggaran"
                    value="Penampilan"
                    onChange={(e) => setJenisPelanggaran(e.target.value)}
                  />
                  <label htmlFor="Penampilan">Penampilan</label>
                  <br />

                  <p>Jenis Pelanggaran yang dipilih: {jenisPelanggaran}</p>
                </form>
                <input
                  type="text"
                  className="border p-2 w-full mt-2"
                  placeholder="Keterangan..."
                  value={keterangan}
                  onChange={(e) => setKeterangan(e.target.value)}
                />
                <button
                  className="bg-red-500 text-white p-2 mt-2 w-full"
                  onClick={handleBuatSP}
                  onMouseEnter={(e) =>
                    ((e.target as HTMLButtonElement).style.cursor = "pointer")
                  }
                >
                  Buat SP
                </button>
                <button
                  className="bg-gray-500 text-white p-2 mt-2 w-full"
                  onClick={cekSP}
                  onMouseEnter={(e) =>
                    ((e.target as HTMLButtonElement).style.cursor = "pointer")
                  }
                >
                  Cek Jumlah SP
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>

      <div className="flex justify-between mt-4">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          onMouseEnter={(e) =>
            ((e.target as HTMLButtonElement).style.cursor = "pointer")
          }
          className="bg-gray-500 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span className="text-lg">
          Halaman {currentPage} dari {totalPages}
        </span>
        <button
          disabled={currentPage === totalPages}
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          className="bg-gray-500 text-white px-4 py-2 rounded disabled:opacity-50"
          onMouseEnter={(e) =>
            ((e.target as HTMLButtonElement).style.cursor = "pointer")
          }
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
