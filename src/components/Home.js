import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';

function Home() {
  const [roomId, setRoomId] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleCreateRoom = async () => {
    try {
      setLoading(true); 
      const response = await axios.get('https://file-vault-psi.vercel.app/room/create');
      if (response.status === 201) {
        setLoading(false)
        navigate(`/room/${response.data.roomId}`);
      } else {
        setLoading(false)
        toast.error("Failed to create room:")
        console.error('Failed to create room:', response.data);
      }
      
    } catch (error) {
      setLoading(false)
      console.error('Error creating room:', error);
      toast.error('Error creating room')
    }
  };

  const handleJoinRoom = async () => {
    if (roomId.trim()) {
      try {
        setLoading(true); 
        const response = await axios.get(`https://file-vault-psi.vercel.app/room/${roomId}`);
        if (response.status === 200) {
          setLoading(false)
          navigate(`/room/${roomId}`);
        } else {
          setLoading(false)
          console.error('Room not found:', response.data);
          toast.error("Room not found")
        }
      } catch (error) {
        setLoading(false)
        console.error('Error joining room:', error);
        toast.error('Error joining room')

      }
    }
  };
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen card p-6">
        <div className="loader"></div>
      </div>
    ); // Show loading message
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen card p-6">
      <h1 className="text-4xl font-bold mb-6 text-white">FileVault</h1>
      <button
        onClick={handleCreateRoom}
        className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-blue-600 transition duration-200"
      >
        Create a Room
      </button>
      <div className="mt-6 flex flex-col items-center space-y-4">
        <input
          type="text"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
          placeholder="Enter Room ID"
          className="border border-gray-300 rounded-lg px-4 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleJoinRoom}
          className="bg-green-500 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-green-600 transition duration-200"
        >
          Join Room
        </button>
      </div>
    </div>
  );
}

export default Home;
