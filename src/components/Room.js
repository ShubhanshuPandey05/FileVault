import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import RoomFiles from './RoomFiles';
import { toast } from 'react-toastify';
import copyIcon from './assets/copy-icon.png'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';



function Room() {
  const { roomId } = useParams();
  const [file, setFile] = useState(null);
  const [files, setFiles] = useState([]);
  const [dragOver, setDragOver] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();


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
      // const response = await fetch(`http://localhost:5000/upload/${roomId}`, {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      if (response.ok) {
        toast.success("File Uploaded...")
        setFiles((prevFiles) => [...prevFiles, result]);
        setLoading(false)
        setFile(null);
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
  
  const roomDelete = async()=>{
    // eslint-disable-next-line no-restricted-globals
    const isConfirmed = confirm(`Are you sure you want to delete this ${roomId} Room?`);

    if (isConfirmed) {
      try {
        setLoading(true);
        const response = await fetch(`https://filevault-plyk.onrender.com/delete/room/${roomId}`, {
        // const response = await fetch(`http://localhost:5000/delete/room/${roomId}`, {
          method: 'DELETE',
          });
          if (response.status === 200) {
            navigate(`/`);
            toast.success("Room Deleted...")
          }
          setLoading(false)
    }catch(error){
      setLoading(false)

      toast.error('Error deleting room')
      console.log(error);
      
    }
  }
}

  const handleDelete = async (fileId) => {
    console.log('Attempting to delete file with ID:', fileId);

    // eslint-disable-next-line no-restricted-globals
    const isConfirmed = confirm("Are you sure you want to delete this file?");


    if (isConfirmed) {
      try {
        const response = await axios.delete(`https://filevault-plyk.onrender.com/delete/${fileId}?roomId=${roomId}`);
        // const response = await axios.delete(`http://localhost:5000/delete/${fileId}?roomId=${roomId}`);
        if (response.status === 201) {  // Changed to 200
          setFiles(files.filter((file) => file._id !== fileId)); // Update files list
          toast.success("File Deleted Successfully");
        } else {
          toast.error(response.data.message || "Failed to delete file"); // Handle any non-200 responses
        }
      } catch (error) {
        toast.error("Error deleting file");
        console.log("Error:", error.response ? error.response.data : error.message); // Log detailed error if available
      }
    }
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
      <div>
        <h1 className="text-3xl font-bold mb-6 text-white flex lg:space-x-20 flex-col lg:flex-row">
          <div>
            Room ID : {roomId}
            <button
              onClick={handleCopy}
            >
              <img src={copyIcon} alt="" className='w-6 ml-2' />
            </button>
          </div>
          <div onClick={()=>roomDelete()} className='bg-red-600 text-sm rounded-full m-auto text-white mt-5 lg:mt-0 h-9 px-4 flex cursor-pointer justify-center items-center transition-transform transform  '>
            Delete Room
          </div>
        </h1>
      </div>
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
      <RoomFiles roomId={roomId} files={files} setFiles={setFiles} handleDelete={handleDelete} />
      <button className='px-5 py-2 rounded-lg bg-red-500 text-white m-20 hover:bg-red-600'>
        <Link to="/">Go Home</Link>
      </button>
    </div>
  );
}

export default Room;
