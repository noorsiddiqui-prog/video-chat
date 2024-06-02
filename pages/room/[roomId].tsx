import React, { useEffect, useState } from 'react'
import useSocket from '@/hooks/useSocket'
import usePeer from '@/hooks/usePeer'
import useMediaStream from '@/hooks/useMediaStream'
import Player from '@/components/Player'
import usePlayer from '@/hooks/usePlayer'
import styles from '../../styles/room.module.css'
import { useRouter } from 'next/router'
import Bottom from '@/components/Bottom'
import { cloneDeep } from 'lodash'
import Clipboard from '@/components/ClipBoard/Clipboard'

const RoomId = () => {
  const socket = useSocket()
  const { myId, peer } = usePeer()
  const { stream } = useMediaStream()
  const { roomId } = useRouter().query
  const {
    players,
    setPlayers,
    nonHighlightedPlayers,
    playerHighlighted,
    toggleAudio,
    toggleVideo,
    leaveRoom,
  } = usePlayer(myId, roomId, peer)
  const [users, setUsers] = useState<any[]>([])
  //   useEffect(() => {
  //     socket?.on('connect', () => {
  //       console.log(socket.id, 'id')
  //     })
  //   }, [socket])
  useEffect(() => {
    console.log('trig1')
    if (!socket || !peer || !stream) return
    console.log('trig2')

    const handleUserConnected = (newUser: any) => {
      console.log(`User Connected in room with userId ${newUser}`)
      const call = peer.call(newUser, stream)
      call.on('stream', (incommingStream: any) => {
        console.log(`incomming stream from ${newUser}`)
        setPlayers((prev: any) => ({
          ...prev,
          [newUser]: {
            url: incommingStream,
            muted: false,
            playing: true,
          },
        }))
      })
      setUsers((prev) => ({
        ...prev,
        [newUser]: call,
      }))
    }

    socket.on('user-connected', handleUserConnected)
    return () => {
      socket.off('user-connected', handleUserConnected)
    }
  }, [socket, setPlayers, peer, stream])

  useEffect(() => {
    if (!peer || !stream) return
    peer.on('call', (call: any) => {
      const { peer: callerId } = call
      call.answer(stream)

      call.on('stream', (incommingStream: any) => {
        console.log(`incomming stream from ${incommingStream}`)
        setPlayers((prev: any) => ({
          ...prev,
          [callerId]: {
            url: incommingStream,
            muted: false,
            playing: true,
          },
        }))
      })
      setUsers((prev) => ({
        ...prev,
        [callerId]: call,
      }))
    })
  }, [peer, stream, setPlayers])

  useEffect(() => {
    if (!stream || !myId) return
    console.log(`Setting my stream ${myId}`)
    setPlayers((prev: any) => ({
      ...prev,
      [myId]: {
        url: stream,
        muted: false,
        playing: true,
      },
    }))
  }, [myId, setPlayers, stream])

  useEffect(() => {
    if (!socket) return
    const handleToggleAudio = (userId: any) => {
      console.log(`user with id ${userId} toggled audio`)
      setPlayers((prev: any) => {
        const copy = cloneDeep(prev)
        copy[userId].muted = !copy[userId].muted
        return { ...copy }
      })
    }

    const handleToggleVideo = (userId: any) => {
      console.log(`user with id ${userId} toggled video`)
      setPlayers((prev: any) => {
        const copy = cloneDeep(prev)
        copy[userId].playing = !copy[userId].playing
        return { ...copy }
      })
    }

    const handleUserLeave = (userId: any) => {
      console.log(`user leave with id ${userId}`)
      users[userId]?.close()
      const playersCopy = cloneDeep(players)
      delete playersCopy[userId]
      setPlayers(playersCopy)
    }

    socket?.on('user-toggle-audio', handleToggleAudio)
    socket?.on('user-toggle-video', handleToggleVideo)
    socket?.on('user-leave', handleUserLeave)

    return () => {
      socket?.off('user-toggle-audio', handleToggleAudio)
      socket?.off('user-toggle-video', handleToggleVideo)
      socket?.off('user-leave', handleUserLeave)
    }
  }, [players, setPlayers, socket, users])

  return (
    <>
      <div className={styles.activePlayerContainer}>
        {playerHighlighted && (
          <Player
            muted={playerHighlighted.muted}
            playing={playerHighlighted.playing}
            url={playerHighlighted.url}
            isActive
          />
        )}
      </div>
      <div className={styles.inActivePlayerContainer}>
        {Object.keys(nonHighlightedPlayers).map((playerId: any) => {
          const { url, muted, playing } = nonHighlightedPlayers[playerId]
          return (
            <Player
              key={playerId}
              muted={muted}
              playing={playing}
              url={url}
              isActive={false}
            />
          )
        })}
      </div>
      <Clipboard roomId={roomId} />
      <Bottom
        muted={playerHighlighted?.muted}
        playing={playerHighlighted?.playing}
        toggleAudio={toggleAudio}
        toggleVideo={toggleVideo}
        leaveRoom={leaveRoom}
      />
      {/* <Player muted={true} playerId={myId} playing url={stream} /> */}
    </>
  )
}

export default RoomId
