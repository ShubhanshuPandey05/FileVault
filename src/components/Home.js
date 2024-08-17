import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';

function Home() {
  const [roomId, setRoomId] = useState('');
  const navigate = useNavigate();

  const handleCreateRoom = async () => {
    try {
      const response = await axios.get('http://localhost:5000/room/create');
      if (response.status === 201) {
        navigate(`/room/${response.data.roomId}`);
      } else {
        console.error('Failed to create room:', response.data);
      }
    } catch (error) {
      console.error('Error creating room:', error);
      toast('Error creating room')
    }
  };

  const handleJoinRoom = async () => {
    if (roomId.trim()) {
      try {
        const response = await axios.get(`http://localhost:5000/room/${roomId}`);
        if (response.status === 200) {
          navigate(`/room/${roomId}`);
        } else {
          console.error('Room not found:', response.data);
          toast.error("Room not found")
        }
      } catch (error) {
        console.error('Error joining room:', error);
        toast.error('Error joining room')

      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <ToastContainer/>
      <h1 className="text-4xl font-bold mb-6">FileVault</h1>
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
