import {Grid, TextField} from "@mui/material";
import {useEffect} from "react";
import {setImgEndpoint} from "../../../store/classroomAdminState";
import {useDispatch, useSelector} from "react-redux";
import {setClassName, setClassLandIds} from "../../../store/classroomAdminState";
import { MuiChipsInput} from "mui-chips-input";
import {createClassroom} from '../../../utils/interact';

export function AddClassroom(props){

    const {className, classLandIds, imgEndpoint} = useSelector((state) => state.classroomAdmin)
    const {roles} = useSelector((state) => state.adminUser)
    const render = roles.includes("classroomAdmin")
    const dispatch = useDispatch()
    const baseUrl = "https://api.decentraland.org/v2/map.png?"

    const handleChange = (newChips) => {
        dispatch(setClassLandIds(newChips))
    }

    useEffect(() => {
        const parsedParcels = classLandIds.join(';')
        const logicalCentre = logicalCentreCoord(classLandIds);
        dispatch(setImgEndpoint(baseUrl + "center=" + logicalCentre + "&size=30&selected=" + parsedParcels))
    },[classLandIds])

    function logicalCentreCoord(coords){
        let sumLat = 0;
        let sumLon = 0;

        for (const coord of coords) {
            const [lat, lon] = coord.split(',').map(parseFloat);

            if (!isNaN(lat) && !isNaN(lon)) {
                sumLat += lat;
                sumLon += lon;
            }
        }

        const averageLatitude = sumLat / coords.length;
        const averageLongitude = sumLon / coords.length;

        const logicalCenter = [Math.round(averageLatitude), Math.round(averageLongitude)];

        console.log("Logical Center Coordinate:", logicalCenter);
        return logicalCenter;
    }

    function createArrayCoordsToInt(coords){
        let arr = [];
        console.log(coords)
        for(let i = 0; i < coords.length; i++){
            console.log(coords[i])
            let coordArr = coords[i].split(",");
            let parsedCoords = coordArr.map(coord => parseInt(coord, 10));
            arr.push(parsedCoords);
        }
        return arr
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
                                        console.log(landIds)
                                        createClassroom(className,landIds).then(result => {
                                            console.log(result)
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
                    />
                </div>
            </div>
            ) : (
                <div>
                    <p>you are not permitted to view this page</p>
                </div>
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