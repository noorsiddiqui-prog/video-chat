import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { v4 as uuidv4 } from 'uuid'

const Room: React.FC = () => {
  const router = useRouter()
  const [roomId, setRoomId] = useState<string>('')
  const createAndJoin = () => {
    const roomId = uuidv4()
    router.push(`/room/${roomId}`)
  }

  const joinRoom = () => {
    if (roomId) {
      router.push(`/room/${roomId}`)
      // router.push(`/${roomId}`)
    } else {
      alert('Please provide a valid room Id')
    }
  }
  return (
    <>
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <h1 className="text-2xl font-bold mb-4 text-center">
            Google Meet Clone
          </h1>
          <div className="space-y-4">
            <div>
              <input
                type="text"
                placeholder="Enter room code"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
              />
              <button
                onClick={joinRoom}
                className="w-full mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300"
              >
                Join Room
              </button>
            </div>
            <div className="text-center text-gray-500">
              -----------OR--------------
            </div>
            <button
              onClick={createAndJoin}
              className="w-full px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition duration-300"
            >
              Create a new Room
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default Room
