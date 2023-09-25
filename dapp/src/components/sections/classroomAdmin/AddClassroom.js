import {TextField} from "@mui/material";
import {useDispatch, useSelector} from "react-redux";
import {setClassName, setClassLandIds} from "../../../store/classroomAdminState";

export function AddClassroom(props){

    const {className, classLandIds} = useSelector((state) => state.classroomAdmin)
    const dispatch = useDispatch()

    function handleSplit(ids){
        let arr = ids.split(",");
        arr = arr.map(item => item.trim().replace(/\n/g, ''));
        return arr;
    }

    return(
        <div className="ui container">
            <div className="ListingsTableContainer_listingsTableContainer__h1r2j ">
                <div className="ui container">
                    <div className="dcl tabs">
                        <div className="dcl tabs-left">
                            <h4>Classroom Administrators</h4>
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
        </div>
    )
}