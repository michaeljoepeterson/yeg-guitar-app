import React from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';

export class SnackbarWrapper extends React.Component{

    snackbarClosed = () => {
        this.props.snackbarClosed(this.props.saveField);
    }
    render(){
        return(
            <div>
                <Snackbar
                    anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                    }}
                    open={this.props.saved}
                    autoHideDuration={5000}
                    onClose={(e) => this.snackbarClosed()}
                    message={this.props.savedMessage}
                    action={
                    <React.Fragment>
                        <IconButton size="small" aria-label="close" color="inherit" onClick={(e) => this.snackbarClosed()}>
                        <CloseIcon fontSize="small" />
                        </IconButton>
                    </React.Fragment>
                    }
                />
            </div>
        )
    }
    
}


export default SnackbarWrapper;