import {useDispatch, useSelector} from "react-redux";
import {createClassroomAdmin, getClassroomAdmins, removeClassroomAdmin} from "../../../utils/interact";
import {useEffect, useState} from "react";
import {setClassroomAdmins, setNewAdminWallet, setNewLandIds} from "../../../store/landOperatorState";
import {Button, Modal} from "@mui/material";
import React from 'react'
import {TextField, Typography} from "@material-ui/core";

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

export function LandOperator(props){

    const {classroomAdmins, newAdminWallet, newLandIds} = useSelector((state) => state.landOperator)
    const {roles} = useSelector((state) => state.adminUser)
    const render = roles.includes("landOperator")
    const dispatch = useDispatch();
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    useEffect( ()=> {
        if(render) {
            getClassroomAdmins().then(result => {
                console.log(result)
                dispatch(setClassroomAdmins(result))
            })
        }
    },[])

    function handleSplit(ids){
        let arr = ids.split(",");
        arr = arr.map(item => parseInt(item.trim().replace(/\n/g, '')));
        return arr;
    }

    return (
        <div className="ui container">
            { render ? (
            <div className="ListingsTableContainer_listingsTableContainer__h1r2j ">
                <div className="ui container">
                    <div className="dcl tabs">
                        <div className="dcl tabs-left">
                            <h4>Classroom Administrators</h4>
                        </div>
                        <div className="dcl tabs-right">
                                <button
                                    onClick={() => handleOpen()}
                                    className="ui small primary button"
                                >Add</button>
                        </div>
                    </div>
                </div>
                <div className="tableContainer">

                    <div className="TableContent">
                        <table className="ui very basic table">

                            <tbody>
                            <tr>
                                <th>Classroom Admin Wallet</th>
                                <th>LANDs</th>
                                <th></th>
                            </tr>

                            {
                                classroomAdmins.map((item, index) => {
                                    return (
                                        <tr key={`Contributor_${index}`}>
                                            <td>
                                                {item["walletAddress"]}
                                            </td>
                                            <td>
                                                {item["landIds"].map((landId, index) => (
                                                    <React.Fragment key={landId}>
                                                        {landId}
                                                        {index < item["landIds"].length - 1 ? ', ' : ''}
                                                    </React.Fragment>
                                                ))}
                                            </td>
                                            <td>
                                                <Button onClick={()=> {
                                                    removeClassroomAdmin(item["walletAddress"]).then(result => {
                                                        console.log(result)
                                                    })
                                                }}>Remove</Button>
                                            </td>
                                        </tr>
                                    );
                                })
                            }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            ) : (
                <div>
                    <p>you are not permitted to view this page</p>
                </div>
            )}
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <div className="ui page modals dimmer transition visible active SignIn center" >
                    <div className="ui modal transition visible active " style={style}>
                        <Typography className="dcl modal-navigation" variant="h6" component="h2">
                            Add Classroom Admin
                        </Typography>
                        <div className="dcl modal-navigation-button modal-navigation-close" onClick={handleClose}>
                        </div>
                        <div style={{width: '80%', margin:'20px auto'}}  className="inputFields">
                            <TextField
                                fullWidth={true}
                                label="Wallet Address"
                                className="textInput"
                                value={newAdminWallet}
                                onChange={(e) => {
                                    dispatch(setNewAdminWallet(e.target.value))
                                }}
                            />
                        </div>
                        <div style={{width: '80%', margin:'20px auto'}}  className="inputFields">
                            <TextField
                                fullWidth={true}
                                label="Land Ids"
                                className="textInput"
                                value={newLandIds}
                                onChange={(e) => {
                                    dispatch(setNewLandIds(e.target.value))
                                }}
                            />
                        </div>
                        <div style={{margin: '15px'}}>
                            <Button
                                className="ui small primary button"
                                onClick={() => {
                                    let idArray = handleSplit(newLandIds)
                                    createClassroomAdmin(newAdminWallet, idArray).then(result =>{
                                        console.log(result)
                                    })
                                }}
                            >
                                add
                            </Button>
                        </div>
                    </div>
                </div>
            </Modal>
        </div>
    )
}