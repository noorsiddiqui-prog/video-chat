import { useState } from 'react'
import { cloneDeep } from 'lodash'
import useSocket from './useSocket'
import { useRouter } from 'next/navigation'

const usePlayer = (myId: string, roomId?: string | string[], peer?: any) => {
  const socket = useSocket()
  const [players, setPlayers] = useState<any>({})
  const playersCopy = cloneDeep(players)
  const router = useRouter()

  const playerHighlighted = playersCopy[myId]
  delete playersCopy[myId]

  const nonHighlightedPlayers = playersCopy

  const toggleAudio = () => {
    console.log('I toggled my audio')
    setPlayers((prev: any) => {
      const copy = cloneDeep(prev)
      copy[myId].muted = !copy[myId].muted
      return { ...copy }
    })
    socket?.emit('user-toggle-audio', myId, roomId)
  }

  const toggleVideo = () => {
    console.log('I toggled my video')
    setPlayers((prev: any) => {
      const copy = cloneDeep(prev)
      copy[myId].playing = !copy[myId].playing
      return { ...copy }
    })
    socket?.emit('user-toggle-video', myId, roomId)
  }

  const leaveRoom = () => {
    socket?.emit('user-leave', myId, roomId)
    console.log('leaving room', roomId)
    peer?.disconnect()
    router.push('/room')
  }

  return {
    players,
    setPlayers,
    playerHighlighted,
    nonHighlightedPlayers,
    toggleAudio,
    toggleVideo,
    leaveRoom,
  }
}

export default usePlayer
