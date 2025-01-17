import styles from './Modal.module.css';
const Modal = ({isOpen, onClose,children}) => {
    if (!isOpen) return null

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <button onClick={onClose} className={styles.closeButton}>X</button>
                {children}
            </div>
        </div>
    );
}

export default Modal;