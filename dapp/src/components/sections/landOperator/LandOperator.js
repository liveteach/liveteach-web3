import {useDispatch, useSelector} from "react-redux";
import {
    createClassroomAdmin, createClassroomAdminCoordinates,
    getClassroomAdmins,
    removeClassroomAdmin
} from "../../../utils/interact";
import {useEffect, useState} from "react";
import {setClassroomAdmins, setNewLandIds, setPending, setNewAdminWallet, setImgEndpoint} from "../../../store/landOperatorState";
import {Button, Grid, Modal} from "@mui/material";
import React from 'react'
import {TextField, Typography} from "@material-ui/core";
import {NoAdmittance} from "../NoAdmittance";
import { logicalCentreCoord } from "../../../utils/utilityFunctions";
import {MuiChipsInput} from "mui-chips-input";

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

    const {classroomAdmins, newAdminWallet, newLandIds, pending, imgEndpoint} = useSelector((state) => state.landOperator)
    const {roles} = useSelector((state) => state.adminUser)
    const render = roles.includes("landOperator") || roles.includes("classroomAdmin")
    const dispatch = useDispatch();
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const baseUrl = "https://api.decentraland.org/v2/map.png?"

    useEffect( ()=> {
        if(render) {
            getClassroomAdmins().then(result => {
                console.log(result)
                dispatch(setClassroomAdmins(result))
            })
        }
    },[])

    useEffect(() => {
        const parsedParcels = newLandIds.join(';')
        const logicalCentre = logicalCentreCoord(newLandIds);
        dispatch(setImgEndpoint(baseUrl + "center=" + logicalCentre + "&size=10&selected=" + parsedParcels))
    },[newLandIds])


    function createArrayCoordsToInt(coords) {
        let arr = [];
        for (let i = 0; i < coords.length; i++) {
            let coordArr = coords[i].split(",").map(coord => parseInt(coord, 10));
            arr.push(coordArr);
        }
        return arr;
    }

    const handleChange = (newChips) => {
        dispatch(setNewLandIds(newChips))
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
                                                <span style={{color:'green', display: 'none'}} id={`adminRemove${index}`}>Pending..</span>
                                            </td>
                                            <td>
                                                {item["landCoordinates"] && Array.isArray(item["landCoordinates"]) ? (
                                                    <div className="coordinates-container">
                                                        {item["landCoordinates"]
                                                            .map((coords, index) => (
                                                                <span key={index} className="coordinate-item">
                                                                    {index < 2 ? `(${coords[0]},${coords[1]})` : ''}
                                                                    {index === 1 && item["landCoordinates"].length > 2 && (
                                                                        <span className="tooltip">
                                                                            {item["landCoordinates"].map((coords, i) => `(${coords[0]},${coords[1]})`).join("  ")}
                                                                        </span>
                                                                    )}
                                                                </span>
                                                            ))}..
                                                    </div>
                                                ) : (
                                                    <div>Coordinates not available</div>
                                                )}
                                            </td>
                                            <td>
                                                <Button onClick={()=> {
                                                    let text = document.getElementById(`adminRemove${index}`);
                                                    text.style.display = 'block'
                                                    removeClassroomAdmin(item["walletAddress"]).then(result => {
                                                        text.style.display = 'none'
                                                        getClassroomAdmins().then(result => {
                                                            dispatch(setClassroomAdmins(result))
                                                        })
                                                    })

                                                }}>Remove</Button>
                                            </td>
                                        </tr>
                                    );
                                })
                            }
                            {
                                pending.map((item, index) => {
                                    if (item.name !== '' && item.status !== '') {
                                        return (
                                            <tr key={'operator_pending_' + index}>
                                                <td>{item.name}</td>
                                                <td>
                                                    <span style={{ color: 'green' }}>{item.status}</span>
                                                </td>
                                            </tr>
                                        );
                                    } else {
                                        return null;
                                    }
                                })
                            }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            ) : (
                <NoAdmittance/>
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
                            <Grid item xs={6}>
                                <h4>LAND Parcels</h4>
                                <div style={{backgroundColor: 'white', color: 'black'}}>
                                    <MuiChipsInput value={newLandIds} onChange={handleChange} fullWidth={true}/>
                                </div>
                            </Grid>
                            <Grid item xs={6}>
                                <img src={imgEndpoint} style={{width: '100%', marginTop: '20px'}}/>
                            </Grid>
                        </div>
                        <div style={{margin: '15px'}}>
                            <Button
                                className="ui small primary button"
                                onClick={() => {
                                    let idArray = createArrayCoordsToInt(newLandIds)
                                    dispatch(setPending([{name: newAdminWallet, status: "Pending.."}]))
                                    setOpen(false)
                                    console.log(idArray)
                                    createClassroomAdminCoordinates(newAdminWallet, idArray).then(result =>{
                                        console.log(result)
                                        let status = result.success ? "Success" : "Error"
                                        dispatch(setPending([{name: newAdminWallet, status:status}]))

                                        setTimeout(() => {
                                            dispatch(setPending([{name: "", status:""}]))
                                            getClassroomAdmins().then(result => {
                                                console.log(result)
                                                dispatch(setClassroomAdmins(result))
                                            })
                                        }, 1000)
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