import {Grid, TextField,Button} from "@mui/material";
import {useSelector} from "react-redux";
import {useState} from "react";

export function EditClass(props){

    const { selectedClass } = useSelector((state) => state.teacher)

    return (
        <div className="ui container">
            <div className="ListingsTableContainer_listingsTableContainer__h1r2j ">
                <div className="ui container">
                    <div className="dcl tabs">
                        <div className="dcl tabs-left">
                            <h4>Edit Class</h4>
                        </div>
                        <div className="dcl tabs-right">
                            <Button
                                onClick={() => {
                                    console.log("Clicky")
                                }}
                                className="ui small primary button"
                            >Delete</Button>
                        </div>
                    </div>
                </div>
                <Grid container>
                    <Grid item xs={8}>
                        <div className={"inputFields"}>
                            <h4>Class Config Reference</h4>
                            <TextField
                                fullWidth={true}
                                className="textInput"
                                color="error"

                            />
                        </div>
                    </Grid>
                    <Grid item xs={8}>
                        <div className={"inputFields"}>
                            <h4>Class Configuration</h4>
                            <TextField
                                fullWidth={true}
                                className="textInput"
                                color="error"

                            />
                        </div>
                    </Grid>
                </Grid>
            </div>
        </div>
   )
}