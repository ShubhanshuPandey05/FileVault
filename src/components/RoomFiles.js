import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

// Import icons or placeholders for non-image files
import pdfIcon from './assets/pdf-icon.png';
import zipIcon from './assets/zip-icon.png';
import docIcon from './assets/docx-icon.png';
import pptIcon from './assets/pptx-icon.png';
import txtIcon from './assets/txt-icon.png';
import xlsIcon from './assets/xlsx-icon.png';
import fileIcon from './assets/file-icon.png'; 

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
                toast.error("Error fetching files");
            }
        };
        fetchFiles();
    }, [roomId, setFiles]);

    // Function to determine the correct icon or image to display
    const getFilePreview = (file) => {
        const imageExtensions = ['jpg', 'jpeg', 'png', 'gif'];
        const fileExtension = file.filename.split('.').pop().toLowerCase();

        if (imageExtensions.includes(fileExtension)) {
            return file.url; // Return the image URL for image files
        } else if (fileExtension === 'pdf') {
            return pdfIcon; // Return the PDF icon
        } else if (fileExtension === 'zip' || fileExtension === 'rar') {
            return zipIcon; // Return the ZIP icon
        } else if (fileExtension === 'doc' || fileExtension === 'docx') {
            return docIcon; // Return the DOCX icon
        } else if (fileExtension === 'ppt' || fileExtension === 'pptx') {
            return pptIcon; // Return the PPTX icon
        } else if (fileExtension === 'txt') {
            return txtIcon; // Return the TXT icon
        } else if (fileExtension === 'xls' || fileExtension === 'xlsx') {
            return xlsIcon; // Return the XLSX icon
        } else {
            return fileIcon; // Return a generic file icon for unknown formats
        }
    };

    if (error) {
        return <div className="text-red-500">Error: {error.message}</div>;
    }

    return (
        <div className="mt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {files.map((file, index) => (
                    <div key={index} className="relative group flex flex-col justify-center items-center">
                        <img
                            src={getFilePreview(file)}
                            alt={file.filename}
                            className="w-full h-32 object-cover rounded-md"
                            style={{ objectFit: 'cover', width: '150px', height: '150px' }}
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
                        <div className="mt-2 text-center text-sm text-gray-600">
                            {file.filename}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RoomFiles;
