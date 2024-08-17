import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const RoomFiles = ({ roomId, files, setFiles }) => {
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchFiles = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/room/${roomId}/files`);
                setFiles(response.data);
            } catch (err) {
                setError(err);
                console.error('Error fetching files:', err);
                toast.error("Error fetching files")
            }
        };
        fetchFiles();
    }, [roomId, setFiles]);

    if (error) {
        return <div className="text-red-500">Error: {error.message}</div>;
    }

    return (
        <div className="mt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {files.map((file, index) => (
                    <div key={index} className="relative group">
                        <img
                            src={file.url}
                            alt={file.filename}
                            className="w-full h-32 object-cover rounded-md"
                        />
                        <div className="absolute inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <a
                                href={file.url}
                                download
                                className="text-white font-semibold text-sm hover:underline"
                            >
                                Download
                            </a>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RoomFiles;
