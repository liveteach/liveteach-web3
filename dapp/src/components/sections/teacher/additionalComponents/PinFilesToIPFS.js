import {pinFileToIPFS} from "../../../../utils/pinata";
import {Button, Modal, TextField} from "@mui/material";
import {Typography} from "@material-ui/core";
import {setJwtToken} from "../../../../store/teacherState";
import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";

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
export function PinFilesToIPFS(props){
    const { jwtToken } = useSelector((state) => state.teacher)
    const dispatch = useDispatch()

    const handleOpen = () => props.setOpen(true);
    const handleClose = () => props.setOpen(false);
    const [selectedFile, setSelectedFile] = useState(null);

    function handleChangeInput(url, index){
        const values = [...props.fields];
        values[index]["src"] = url;
        props.setFields(values);
    }
    
    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const handleUpload = () => {
        if (selectedFile) {
            console.log('Selected File:', selectedFile);
            handleOpen()
        } else {
            console.log('No file selected.');
        }
    };

    const handlePublish = (src, index) => {
       pinFileToIPFS(jwtToken, src).then(response => {
           handleChangeInput(response, index)
           document.getElementById("ipfsFilePending" + props.index).style.display = "none"
        })
    }

    return (
        <div>
            <div>
                <h2>File Upload</h2>
                <input type="file" onChange={handleFileChange} />
                <button onClick={handleUpload}>Upload</button>
            </div>
            <Modal
                open={props.open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <div className="ui page modals dimmer transition visible active SignIn center" >
                    <div className="ui modal transition visible active " style={style}>
                        <Typography className="dcl modal-navigation" variant="h6" component="h2">
                            Please Enter your Pinata JWT
                        </Typography>
                        <div className="dcl modal-navigation-button modal-navigation-close" onClick={handleClose}>
                        </div>
                        <div style={{width: '80%', margin:'20px auto'}}  className="inputFields">
                            <TextField
                                fullWidth={true}
                                label="JWT"
                                className="textInput"
                                value={jwtToken}
                                onChange={(e) => {
                                    dispatch(setJwtToken(e.target.value))
                                }}
                            />
                        </div>

                        <div style={{margin: '15px'}}>
                            <Button
                                className="ui small primary button"
                                value={props.src}
                                name="src"
                                onClick={(e) => {
                                    handlePublish(selectedFile, props.index)
                                    handleClose()
                                    document.getElementById("ipfsFilePending" + props.index).style.display = "block"
                                }}
                            >
                                Publish
                            </Button>
                        </div>
                    </div>
                </div>
            </Modal>
        </div>
    )
}