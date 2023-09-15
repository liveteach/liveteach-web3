import {TextField} from "@mui/material";

export function AddClassroom(props){
    return(
        <div className="ui container">
            <div className="ListingsTableContainer_listingsTableContainer__h1r2j ">
                <div className="ui container">
                    <div className="dcl tabs">
                        <div className="dcl tabs-left">
                            <h4>Add Classroom</h4>
                        </div>
                    </div>
                </div>
                <div className="inputFields">
                    <h4>Classroom Name</h4>
                    <TextField
                        fullWidth={true}
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