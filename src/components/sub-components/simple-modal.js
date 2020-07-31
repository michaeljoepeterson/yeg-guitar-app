import Modal from '@material-ui/core/Modal';
import React from 'react';
import Button from '@material-ui/core/Button';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import Paper from '@material-ui/core/Paper';
import './styles/modal-styles.css';

export default function SimpleModal(props){
   
    const submitClicked = () => {
        props.submitClick();
    }

    const closeModal = () => {
        props.handleClose();
    }

    const body = (
        <div style={props.modalStyle} className="modal-container">
            <Paper className="paper-container">
                <p id="modal-description">
                    {props.message}
                </p>
                <div>
                    <Button onClick={(e) => submitClicked(e)} variant="contained">{props.submit ? props.submit : 'Submit'}</Button>
                    <Button onClick={(e) => closeModal(e)} variant="contained">{props.cancel ? props.cancel : 'Cancel'}</Button>
                </div>
            </Paper>
        </div>
    );
    
    return(
        <Modal
        open={props.open}
        onClose={props.handleClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        closeAfterTransition 
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={props.open}>
          {body}
        </Fade>
      </Modal>
    )
} 