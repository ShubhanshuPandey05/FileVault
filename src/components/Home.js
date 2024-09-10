import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

function Home() {
  const [roomId, setRoomId] = useState('');
  const [newRoomId, setNewRoomId] = useState('');
  const [loading, setLoading] = useState(false);
  const [hide, setHide] = useState(true)
  const navigate = useNavigate();

  const handleCreateRoom = async () => {
    try {
      setLoading(true);

      const response = await axios.post('https://filevault-plyk.onrender.com/room/create', {
      // const response = await axios.post('http://localhost:5000/room/create', {
        roomId: newRoomId
      });

      if (response.status === 201) {
        navigate(`/room/${response.data.roomId}`);
      } else {
        console.log("1");

        toast.error(response.data || 'Failed to create room');
        console.error('Failed to create room:', response.data);
      }

    } catch (error) {
      console.log("2");
      console.error('Error creating room:', error);

      if (error.response) {
        console.log("3");
        console.log(error.response);
        toast.error(error.response.data || 'Failed to create room');
      } else if (error.request) {
        console.log("4");
        toast.error('No response from server');
      } else {
        toast.error('Error in setting up the request');
      }
    } finally {
      setLoading(false);
    }
  };


  const handleJoinRoom = async () => {
    if (roomId.trim()) {
      try {
        setLoading(true);
        const response = await axios.get(`https://filevault-plyk.onrender.com/room/${roomId}`);
        // const response = await axios.get(`http://localhost:5000/room/${roomId}`);
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
        toast.error(error.response.data.error)

      }
    }
  };
  const handleToggle = () => {
    setHide(!hide)
  }
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen card p-6">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen card p-6">
      <h1 className="text-4xl font-bold mb-6 text-white">FileVault</h1>

      {
        hide?<div className=" flex flex-col items-start space-y-4 card p-3 mt-6">
        <input
          type="text"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
          placeholder="Enter Room ID"
          className="border border-gray-300 rounded-lg px-4 py-2 w-[18.5rem] focus:outline-none focus:ring-2 focus:ring-blue-500 card text-white"
        />
      </div>:<></>
      }
        {hide?<div className='m-5'>
        <button
          onClick={handleJoinRoom}
          className="bg-green-500 text-white font-semibold py-2 px-4 w-32 rounded-lg shadow-md hover:bg-green-600 transition duration-200"
        >
          Join Room
        </button>
        </div>:<></>}
        
      {
        hide?<></>:<div className="flex flex-col items-end space-y-4 p-3 card mt-6">
        <input
          type="text"
          value={newRoomId}
          onChange={(e) => setNewRoomId(e.target.value)}
          placeholder="Enter Room ID"
          className="border border-gray-300 rounded-lg px-4 py-2 w-[18.5rem] focus:outline-none focus:ring-2 focus:ring-blue-500 card text-white"
        />
      </div>
      }
      {hide? <></>:<div className='mt-5'>
        <button
          onClick={handleCreateRoom}
          className="bg-blue-500 text-white font-semibold py-2 w-32 px-4 rounded-lg shadow-md hover:bg-blue-600 transition duration-200"
        >
          Create Room
        </button>
        </div>}
      {!hide?<h1 className='text-white cursor-pointer hover:underline mt-6' onClick={handleToggle}>Join Room</h1>:<h1 className='text-white cursor-pointer hover:underline' onClick={handleToggle}>Create Room</h1>}

    </div>
  );
}

export default Home;
