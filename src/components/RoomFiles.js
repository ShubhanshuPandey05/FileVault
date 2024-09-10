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
import videoIcon from './assets/mp4-icon.png';
import audioIcon from './assets/mp3-icon.png';
import tcpIcon from './assets/tcp-icon.png';

const RoomFiles = ({ roomId, files, setFiles, handleDelete }) => {
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchFiles = async () => {
            try {
                const response = await axios.get(`https://filevault-plyk.onrender.com/room/${roomId}/files`);
                setFiles(response.data);
            } catch (err) {
                setError(err);
                console.error('Error fetching files:', err);
                toast.error("Error fetching files");
            }
        };
        fetchFiles();
    }, [roomId, setFiles]);



    const generateTempUrl = async (fileId) => {
        try {
            const response = await axios.get(`https://filevault-plyk.onrender.com/temp/generate-temp-url/${fileId}`);
            navigator.clipboard.writeText(response.data.tempUrl).then(() => {
                toast.success('File LInk copied!');
            })
                .catch(() => {
                    toast.error('Failed to copy!');
                });
        } catch (error) {
            console.error('Failed to generate temporary URL:', error);
        }
    };
    // Function to determine the correct icon or image to display
    const getFilePreview = (file) => {
        const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'webp'];
        const videoExtensions = ['mp4', 'avi', 'mov', 'mkv', 'webm', 'flv', 'wmv'];
        const audioExtensions = ['mp3', 'wav', 'ogg', 'flac', 'aac', 'm4a', 'wma', 'aiff', 'alac'];
        const fileExtension = file.filename.split('.').pop().toLowerCase();

        if (imageExtensions.includes(fileExtension)) {
            return file.url;
        } else if (fileExtension === 'pdf') {
            return pdfIcon;
        } else if (fileExtension === 'zip' || fileExtension === 'rar') {
            return zipIcon;
        } else if (fileExtension === 'doc' || fileExtension === 'docx') {
            return docIcon;
        } else if (fileExtension === 'ppt' || fileExtension === 'pptx') {
            return pptIcon;
        } else if (fileExtension === 'txt') {
            return txtIcon;
        } else if (fileExtension === 'xls' || fileExtension === 'xlsx') {
            return xlsIcon;
        } else if (fileExtension === 'tcp') {
            return tcpIcon;
        } else if (audioExtensions.includes(fileExtension)) {
            return audioIcon;
        } else if (videoExtensions.includes(fileExtension)) {
            return videoIcon;
        } else {
            return fileIcon;
        }
    };

    if (error) {
        return (
            <div>

                <div className="text-red-500">Error: {error.message}</div>
            </div>
        );
    }

    return (
        <div className="mt-6">

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-10 overflow-auto w-full">
                {files.map((file, index) => (
                    <div className="flex flex-col items-center p-4 bg-gray-900 rounded-lg shadow-lg">
                        {/* File Preview Section */}
                        <div className="relative flex flex-col items-center">
                            <img
                                src={getFilePreview(file)}
                                alt={file.filename}
                                className="rounded-lg"
                                style={{ width: '120px', height: '120px' }}
                            />
                        </div>

                        {/* File Info */}
                        <div className="mt-3 text-center">
                            <p className="text-white font-semibold text-sm">{file.filename}</p>
                        </div>

                        {/* Action Buttons: Download and Copy Link */}
                        <div className="mt-2 flex space-x-4 justify-center">
                            {/* Download Button */}
                            <a href={file.url}>
                                <button
                                    className="flex items-center bg-blue-600 text-white text-sm px-3 py-1 rounded-full space-x-2 hover:bg-blue-500 transition-colors duration-200"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                    <span>Download</span>
                                </button>
                            </a>

                            {/* Copy Link Button */}
                            <button
                                className="flex items-center bg-green-600 text-white px-3 py-1 text-sm rounded-full space-x-2 hover:bg-green-500 transition-colors duration-200"
                                onClick={() => generateTempUrl(file._id)}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1v4H9l3 3 3-3z" />
                                </svg>
                                <span>CopyLink</span>
                            </button>
                        </div>

                        {/* Bottom Section: Date, Time, and Delete */}
                        <div className="flex justify-between items-center w-full mt-3">
                            <div className="flex flex-col text-center text-white text-sm">
                                <p>{new Date(file.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}</p>
                                <p>{new Date(file.createdAt).toLocaleDateString()}</p>
                            </div>
                            <button
                                className="bg-red-600 p-2 rounded-full transition-transform transform hover:scale-110"
                                onClick={() => handleDelete(file._id)}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                    </div>




                ))}
            </div>
        </div>
    );
};

export default RoomFiles;
