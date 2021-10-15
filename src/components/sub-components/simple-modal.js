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
        props.handleClose(props.name);
    }

    const body = !props.children ? (
        <div style={props.modalStyle} className="modal-container modal-body">
            <Paper className="paper-container modal-body">
                <p className="modal-desc" id="modal-description">
                    {props.message}
                </p>
                <div>
                    <Button onClick={(e) => closeModal(e)} variant="contained">{props.cancel ? props.cancel : 'Cancel'}</Button>
                    <Button color={props.color ? props.color :'primary'} onClick={(e) => submitClicked(e)} variant="contained">{props.submit ? props.submit : 'Submit'}</Button>
                </div>
            </Paper>
        </div>
    ) : (
    <div style={props.modalStyle} className="modal-container modal-body">
        <Paper className="paper-container modal-body">
            <div className="modal-desc" id="modal-description">
                {props.children}
            </div>
            <div>
                {
                    props.submitClick ? <Button onClick={(e) => submitClicked(e)} variant="contained">{props.submit ? props.submit : 'Submit'}</Button> : null
                }
                <Button onClick={(e) => closeModal(e)} variant="contained">{props.cancel ? props.cancel : 'Cancel'}</Button>
            </div>
        </Paper>
    </div>);

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