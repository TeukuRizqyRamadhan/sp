import { useState } from "react";
import Papa from "papaparse";
import API from "../api/api";

type Siswa = {
    nama: string;
    kelas: string;
};

const UploadSiswa = () => {
    const [dataSiswa, setDataSiswa] = useState<Siswa[]>([]);
    const [fileName, setFileName] = useState<string>("");

    // Handle file upload
    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (file.type !== "text/csv") {
            alert("Hanya file CSV yang diperbolehkan.");
            return;
        }

        setFileName(file.name);

        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: (result) => {
                const parsedData = result.data as Siswa[];
                setDataSiswa(parsedData);
            },
        });
    };

    // Handle upload ke backend
    const handleUpload = async () => {
        if (dataSiswa.length === 0) {
            alert("Tidak ada data yang diunggah.");
            return;
        }

        try {
            await API.post("/siswa/upload-massal", { data: dataSiswa });
            alert("Data siswa berhasil diunggah!");
            setDataSiswa([]);
            setFileName("");
        } catch (error) {
            console.error("Error uploading data:", error);
            alert("Gagal mengunggah data siswa.");
        }
    };

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Upload Massal Siswa</h2>

            <input
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="mb-4"
            />

            {fileName && <p className="text-sm text-gray-500">File: {fileName}</p>}

            {dataSiswa.length > 0 && (
                <div>
                    <h3 className="text-lg font-semibold mt-4">Preview Data:</h3>
                    <table className="w-full border-collapse border border-gray-300 mt-2">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="border border-gray-300 p-2">Nama</th>
                                <th className="border border-gray-300 p-2">Kelas</th>
                            </tr>
                        </thead>
                        <tbody>
                            {dataSiswa.map((siswa, index) => (
                                <tr key={index}>
                                    <td className="border border-gray-300 p-2">{siswa.nama}</td>
                                    <td className="border border-gray-300 p-2">{siswa.kelas}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <button
                        onClick={handleUpload}
                        className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
                    >
                        Upload ke Database
                    </button>
                </div>
            )}
        </div>
    );
};

export default UploadSiswa;
