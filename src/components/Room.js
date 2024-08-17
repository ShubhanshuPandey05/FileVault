import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import RoomFiles from './RoomFiles';
import { toast } from 'react-toastify';

function Room() {
  const { roomId } = useParams();
  const [file, setFile] = useState(null);
  const [files, setFiles] = useState([]);
  const [dragOver, setDragOver] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleFileDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files.length > 0) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleFileDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleFileUpload = async () => {
    if (!file) {
      alert('Please select a file to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`http://localhost:5000/upload/${roomId}`, {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      if (response.ok) {
        alert('File uploaded successfully!');
        setFiles((prevFiles) => [...prevFiles, result]);
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error('Error uploading file')
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6">Room ID: {roomId}</h1>
      
      <div
        className={`border-2 border-dashed border-gray-300 rounded-lg p-10 w-full max-w-2xl text-center ${dragOver ? 'bg-gray-200' : 'bg-white'}`}
        onDrop={handleFileDrop}
        onDragOver={handleFileDragOver}
        onDragLeave={handleFileDragLeave}
      >
        <p className="text-gray-600 mb-2">Drag & Drop your file here or</p>
        <input
          type="file"
          onChange={handleFileChange}
          className="hidden"
          id="file-input"
        />
        <label htmlFor="file-input" className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg cursor-pointer hover:bg-blue-600 transition duration-200">
          Browse Files
        </label>
        {file && (
          <p className="mt-4 text-gray-800 font-semibold">
            Selected file: {file.name}
          </p>
        )}
      </div>

      <button
        onClick={handleFileUpload}
        className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-blue-600 transition duration-200 mt-4"
      >
        Upload File
      </button>

      <h2 className="text-2xl font-semibold mb-4">Files in this Room</h2>
      <RoomFiles roomId={roomId} files={files} setFiles={setFiles} />
      <button className='px-5 py-2 border-2 rounded-lg bg-red-500 text-white m-20 hover:bg-red-600'>
        <Link to="/">Go Home</Link>
      </button>
    </div>
  );
}

export default Room;
