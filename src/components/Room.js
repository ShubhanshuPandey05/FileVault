import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import RoomFiles from './RoomFiles';
import { toast } from 'react-toastify';
import copyIcon from './assets/copy-icon.png'

function Room() {
  const { roomId } = useParams();
  const [file, setFile] = useState(null);
  const [files, setFiles] = useState([]);
  const [dragOver, setDragOver] = useState(false);
  const [loading, setLoading] = useState(false);

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
      toast.error('Please select a file to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      setLoading(true);
      const response = await fetch(`https://filevault-plyk.onrender.com/upload/${roomId}`, {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      if (response.ok) {
        toast.success("File Uploaded...")
        setFiles((prevFiles) => [...prevFiles, result]);
        setLoading(false)
      } else {
        toast.error(result.error);
        setLoading(false)
      }

    } catch (error) {
      toast.error('Error uploading file')
      setLoading(false)
      console.error('Error uploading file:', error);
    }
  };
  const handleCopy = () => {
    navigator.clipboard.writeText(roomId)
      .then(() => {
        toast.success('Room ID copied!');
      })
      .catch(() => {
        toast.error('Failed to copy!');
      });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen card p-6">

        <div className="loader"></div>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen card p-6">
      

      <h1 className="text-3xl font-bold mb-6 text-white">Room ID: {roomId}
        <button
          onClick={handleCopy}
        >
          <img src={copyIcon} alt="" className='w-6 ml-2' />
        </button>
      </h1>
      <p className='text-red-500 mb-5'>
        Make sure to copy the Room ID for future access. You won't be able to access this room without it!
      </p>

      <div
        className={`border-2 border-dashed border-gray-300 rounded-lg p-10 w-full max-w-2xl text-center bg-opacity-50 ${dragOver ? 'bg-[rgba(209,213,219,0.64)]' : 'bg-[rgba(255,255,255,0.25)]'}`}
        onDrop={handleFileDrop}
        onDragOver={handleFileDragOver}
        onDragLeave={handleFileDragLeave}
      >
        <p className="text-white mb-2">Drag & Drop your file here or</p>
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
          <p className="mt-4 text-white font-semibold">
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

      <h2 className="text-2xl font-semibold mb-4 text-white">Files in this Room</h2>
      <RoomFiles roomId={roomId} files={files} setFiles={setFiles} />
      <button className='px-5 py-2 rounded-lg bg-red-500 text-white m-20 hover:bg-red-600'>
        <Link to="/">Go Home</Link>
      </button>
    </div>
  );
}

export default Room;
