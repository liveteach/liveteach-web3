import {Grid, TextField} from "@mui/material";
import {useEffect} from "react";
import {setClassrooms, setGuid, setImgEndpoint} from "../../../store/classroomAdminState";
import {useDispatch, useSelector} from "react-redux";
import {setClassName, setClassLandIds, setPendingClassrooms} from "../../../store/classroomAdminState";
import { MuiChipsInput} from "mui-chips-input";
import {createClassroom, getClassrooms} from '../../../utils/interact';
import {NoAdmittance} from "../NoAdmittance";
import { logicalCentreCoord } from "../../../utils/utilityFunctions";

export function AddClassroom(props){

    const {className, classLandIds, imgEndpoint, guid} = useSelector((state) => state.classroomAdmin)
    const {roles} = useSelector((state) => state.adminUser)
    const render = roles.includes("classroomAdmin")
    const dispatch = useDispatch()
    const baseUrl = "https://api.decentraland.org/v2/map.png?"

    const handleChange = (newChips) => {
        dispatch(setClassLandIds(newChips))
    }

    useEffect(() => {
        dispatch(setGuid(getGuid()))
    },[])

    useEffect(() => {
        const parsedParcels = classLandIds.join(';')
        const logicalCentre = logicalCentreCoord(classLandIds);
        dispatch(setImgEndpoint(baseUrl + "center=" + logicalCentre + "&size=30&selected=" + parsedParcels))
    },[classLandIds])


    function createArrayCoordsToInt(coords) {
        let arr = [];
        for (let i = 0; i < coords.length; i++) {
            let coordArr = coords[i].split(",").map(coord => parseInt(coord, 10));
            arr.push(coordArr);
        }
        return arr;
    }

    function getGuid() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16)
        })
    }

    return(
        <div className="ui container">
            {render ? (
            <div className="ListingsTableContainer_listingsTableContainer__h1r2j ">
                <div className="ui container">
                    <div className="dcl tabs">
                        <div className="dcl tabs-left">
                            <h4>Add Classroom</h4>
                        </div>
                        <div className="dcl tabs-right">
                                <button
                                    onClick={() => {
                                        let landIds = createArrayCoordsToInt(classLandIds);
                                        dispatch(setPendingClassrooms([{name: className, status: "Pending.."}]))

                                        createClassroom(className,landIds, guid).then(result => {

                                            let status = result.success ? "Success" : "Error"
                                            dispatch(setPendingClassrooms([{name: className, status:status}]))

                                            setTimeout(() => {
                                                dispatch(setPendingClassrooms([{name: "", status:""}]))
                                                getClassrooms().then(result => {
                                                    dispatch(setClassrooms(result))
                                                })
                                            }, 1000)

                                        })
                                    }}
                                    className="ui small primary button"
                                >Add</button>
                        </div>
                    </div>
                </div>
                <div className="inputFields">
                    <h4>Classroom Name</h4>
                    <TextField
                        fullWidth={true}
                        value={className}
                        onChange={(e) => {
                            dispatch(setClassName(e.target.value))
                        }}
                        className="textInput"
                        color="error"
                    />
                </div>
                <div className="inputFields">
                    <h4>ClassID (Generated)</h4>
                    <TextField
                        fullWidth={true}
                        className="textInput"
                        color="error"
                        disabled
                        value={guid}
                    />
                </div>
            </div>
            ) : (
                <NoAdmittance/>
            )}
            { render ? (
            <div className="ui container">
                <Grid container>
                    <Grid item xs={6}>
                        <h4>LAND Parcels</h4>
                        <div style={{backgroundColor: 'white', color: 'black'}}>
                            <MuiChipsInput value={classLandIds} onChange={handleChange} fullWidth={true}/>
                        </div>
                    </Grid>
                    <Grid item xs={6}>
                            <img src={imgEndpoint} style={{width: '40%', marginLeft: '100px'}}/>
                    </Grid>
                </Grid>
            </div>
                ) : (
                <div>
                </div>
                )}
        </div>
    )
}