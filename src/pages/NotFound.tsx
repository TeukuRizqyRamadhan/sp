import { Link } from "react-router-dom";

const NotFound = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen text-center">
            <h1 className="text-4xl font-bold text-red-600">404</h1>
            <p className="text-lg text-gray-700">Halaman yang Anda cari tidak ditemukan.</p>
            <Link to="/" className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg">
                Kembali ke Beranda
            </Link>
        </div>
    );
};

export default NotFound;
