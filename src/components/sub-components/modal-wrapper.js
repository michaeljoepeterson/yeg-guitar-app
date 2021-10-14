import React, {useState} from 'react';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import './styles/modal-styles.css';

export default function ModalWrapper(props){
    const [modalOpen, setModalOpen] = useState(props.open);

    const closeModal = () => {
        setModalOpen(false);
        console.log('close',modalOpen);
        if(props.handleClose){
            props.handleClose(props.name);
        }
    }

    return(
        <Modal
        open={props.open}
        onClose={closeModal}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        closeAfterTransition 
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={props.open}>
            <Box className="modal-wrapper">
                {props.children}
            </Box>
        </Fade>
      </Modal>
    )
} 