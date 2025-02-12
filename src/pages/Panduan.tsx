import { Link } from "react-router-dom";

const Panduan = () => {
    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-4">Panduan Menggunakan Website SP</h1>

            <h2 className="text-2xl font-semibold mt-4">1. Login</h2>
            <p className="text-gray-600">Silahkan login menggunakan username dan password yang sudah diberikan kepada guru piket</p>

            <h2 className="text-2xl font-semibold mt-4">2. Mencari Siswa</h2>
            <p className="text-gray-600">Gunakan fitur cari siswa untuk mencari siswa</p>
            <img src="/src/assets/1.png" alt="Cari Siswa" className="max-w-full" />

            <h2 className="text-2xl font-semibold mt-4">3. Membuat SP dan Cek SP</h2>
            <p className="text-gray-600">Setelah mencari siswa dan dipilih, maka muncul pilihan untuk membuat SP atau cek SP siswa tersebut</p>
            <img src="/src/assets/2.png" alt="Buat SP dan Cek SP" className="max-w-full" />

            <h2 className="text-2xl font-semibold mt-4">4. Membuat SP</h2>
            <p className="text-gray-600">Masukkan keterangan pada kolom yang disediakan dan klik "Buat SP" maka akan muncul validasi lalu tekan OK untuk membuat SP</p>
            <img src="/src/assets/3.png" alt="Buat SP dan Cek SP" className="max-w-full" />
            <img src="/src/assets/4.png" alt="Buat SP dan Cek SP" className="max-w-full" />

            <h2 className="text-2xl font-semibold mt-4">5.Cek SP</h2>
            <p className="text-gray-600">Klik cek SP untuk cek SP siswa tersebut, setelah itu akan muncul halaman detail siswa tersebut pernah berapa kali mendapat SP lengkap dengan tanggal dan hari serta keterangan</p>
            <img src="/src/assets/5.png" alt="Buat SP dan Cek SP" className="max-w-full" />

            <Link to="/" className="mt-6 inline-block px-4 py-2 bg-blue-500 text-white rounded-lg">
                Kembali ke Beranda
            </Link>
        </div>
    );
};

export default Panduan;
