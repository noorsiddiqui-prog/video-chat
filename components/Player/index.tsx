import React from 'react'
import ReactPlayer from 'react-player'
import styles from './player.module.css'
import cx from 'classnames'
import { Mic, MicOff, UserSquare2 } from 'lucide-react'

interface IPlayer {
  url: string
  muted: boolean
  playing: boolean
  isActive: boolean
}

const Player: React.FC<IPlayer> = ({
  url,
  muted,
  playing,
  isActive,
}: IPlayer) => {
  return (
    <div
      className={cx(styles.playerContainer, {
        [styles.active]: isActive,
        [styles.notActive]: !isActive,
        [styles.notPlaying]: !playing,
      })}
    >
      {playing ? (
        <ReactPlayer
          url={url}
          muted={muted}
          playing={playing}
          width="100%"
          height="100%"
        />
      ) : (
        <UserSquare2 className={styles.user} size={isActive ? 400 : 150} />
      )}

      {!isActive ? (
        muted ? (
          <MicOff className={styles.icon} size={20} />
        ) : (
          <Mic className={styles.icon} size={20} />
        )
      ) : undefined}
    </div>
  )
}

export default Player
