import Dialog from '@material-ui/core/Dialog';
import MuiDialogActions from '@material-ui/core/DialogActions';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import React from 'react';
import Cookies from "js-cookie"
import './Modal.css';



export default function CustomizedDialogs({ open, setOpen }) {
 

  const styles = (theme) => ({

  });


  const handleClose = () => {
    setOpen(false);
  };
  const classes=styles
  return (
    <div>
      <Dialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={open} >
        <div style={{display:"flex", justifyContent:"flex-end"}}><CloseIcon onClick={handleClose}/></div>
        <MuiDialogContent style={{ margin: "auto", textAlign: 'center', height:"350px", width:"90%"}}>
        <div style={{color:"", fontSize:"24px", marginTop:"100px"}}>{Cookies.get("trinkerrName")}. You have rated all the images, thank you.</div>
        </MuiDialogContent>
      </Dialog>
    </div>
  );
}