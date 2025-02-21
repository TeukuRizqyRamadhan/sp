import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { ArrowLeft } from "lucide-react";

const Panduan = () => {

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
        <div className="p-6 max-w-4xl mx-auto">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Panduan Menggunakan Website SP</h1>
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                    onMouseEnter={(e) => (e.target as HTMLButtonElement).style.cursor = "pointer"}
                >
                    <ArrowLeft size={18} /> Kembali
                </button>
            </div>

            <h2 className="text-2xl font-semibold mt-4">1. Login</h2>
            <p className="text-gray-600">Silahkan login menggunakan username dan password yang sudah diberikan kepada guru piket</p>

            <h2 className="text-2xl font-semibold mt-4">2. Mencari Siswa</h2>
            <p className="text-gray-600">Gunakan fitur cari siswa untuk mencari siswa</p>
            <img src="/src/assets/1.png" alt="Cari Siswa" className="max-w-full" />

            <h2 className="text-2xl font-semibold mt-4">3. Membuat SP dan Cek SP</h2>
            <p className="text-gray-600">Setelah mencari siswa dan dipilih, maka muncul pilihan untuk membuat SP atau cek SP siswa tersebut</p>
            <img src="/src/assets/2.png" alt="Buat SP dan Cek SP" className="max-w-full" />

            <h2 className="text-2xl font-semibold mt-4">4. Membuat SP</h2>
            <p className="text-gray-600">Pilih jenis pelanggaran dan masukkan keterangan pada kolom yang disediakan dan klik "Buat SP" maka akan muncul validasi lalu tekan OK untuk membuat SP</p>
            <img src="/src/assets/3.png" alt="Buat SP dan Cek SP" className="max-w-full" />
            <img src="/src/assets/4.png" alt="Buat SP dan Cek SP" className="max-w-full" />

            <h2 className="text-2xl font-semibold mt-4">5.Cek SP</h2>
            <p className="text-gray-600">Klik cek SP untuk cek SP siswa tersebut, setelah itu akan muncul halaman detail siswa tersebut pernah berapa kali mendapat SP lengkap dengan tanggal dan hari serta keterangan</p>
            <img src="/src/assets/5.png" alt="Buat SP dan Cek SP" className="max-w-full" />

            <h2 className="text-2xl font-semibold mt-4">6.Export Data</h2>
            <p className="text-gray-600">Klik Export Data pada halaman utama untuk mengunduh data SP</p>
            <img src="/src/assets/6.png" alt="Buat SP dan Cek SP" className="max-w-full" />
            <p className="text-gray-600">Pilih rentang tanggal pada halaman utama untuk mengunduh data SP, per hari, per bulan, atau per tahun</p>
            <img src="/src/assets/7.png" alt="Buat SP dan Cek SP" className="max-w-full" />
            <p className="text-gray-600">Data berhasil diunduh, silahkan cek di folder download</p>
            <img src="/src/assets/8.png" alt="Buat SP dan Cek SP" className="max-w-full" />


        </div>
    );
};

export default Panduan;
