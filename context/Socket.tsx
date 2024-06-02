import React, { createContext, useEffect, useState, ReactNode } from 'react'
import { io, Socket } from 'socket.io-client'

interface SocketProviderProps {
  children: ReactNode
}

const SocketContext = createContext<Socket | null>(null)

const SocketProvider = ({ children }: SocketProviderProps) => {
  const [socket, setSocket] = useState<Socket | null>(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const connection = io()

      connection.on('connect_error', async (err) => {
        console.log('Error establishing socket', err)
        await fetch('/api/socket')
      })

      setSocket(connection)

      return () => {
        connection.disconnect()
      }
    }
  }, [])

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  )
}

export { SocketProvider, SocketContext }
