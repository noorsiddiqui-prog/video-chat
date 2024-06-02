import { CopyToClipboard } from 'react-copy-to-clipboard'
import { Copy } from 'lucide-react'
import styles from './clipboard.module.css'

const Clipboard = (props: any) => {
  const { roomId } = props

  return (
    <div className={styles.copyContainer}>
      <div className={styles.copyHeading}>Copy Room ID:</div>
      <hr />
      <div className={styles.copyDescription}>
        <span>{roomId}</span>
        <CopyToClipboard text={roomId}>
          <Copy className={styles.copyIcon} />
        </CopyToClipboard>
      </div>
    </div>
  )
}

export default Clipboard
