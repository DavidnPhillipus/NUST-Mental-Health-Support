import type { ReactNode } from 'react'
import styles from '../styles/Modal.module.css'

type ModalProps = {
  isOpen: boolean
  onClose(): void
  children: ReactNode
}

export default function Modal({ isOpen, onClose, children }: ModalProps) {
  if (!isOpen) {
    return null
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.panel} onClick={event => event.stopPropagation()}>
        {children}
      </div>
    </div>
  )
}
