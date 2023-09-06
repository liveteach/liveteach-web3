import {Button} from "@mui/material";
import {Modal, Typography} from "@material-ui/core";
import {useState} from "react";

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

export function Test(props){

    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    return(
        <div className="ui container">
            <p> Hello im another Page</p>
            <Button
                onClick={() => handleOpen()}
                className="ui small primary button"
            >Open Modal</Button>

                <Modal
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <div className="ui page modals dimmer transition visible active SignIn center" >
                        <div className="ui modal transition visible active " style={style}>
                            <Typography className="dcl modal-navigation" variant="h6" component="h2">
                                Text in a modal
                            </Typography>
                            <div className="dcl modal-navigation-button modal-navigation-close" onClick={handleClose}>
                            </div>
                            <Typography className="content" sx={{ mt: 2 }}>
                                Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
                            </Typography>
                        </div>
                    </div>
                </Modal>
        </div>
    )
}