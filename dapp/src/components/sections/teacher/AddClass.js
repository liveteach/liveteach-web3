import {Grid, TextField} from "@mui/material";
import LoadingButton from '@mui/lab/LoadingButton';
import {useState} from "react";

export function AddClass(props){

    const [loading,setLoading] = useState(false);

    return (
        <div className="ui container">
            <div className="ListingsTableContainer_listingsTableContainer__h1r2j ">
                <div className="ui container">
                    <div className="dcl tabs">
                        <div className="dcl tabs-left">
                            <h4>Edit Class</h4>
                        </div>
                        <div className="dcl tabs-right">
                            <LoadingButton
                                loading={loading}
                                loadingPosition="middle"

                                onClick={() => {
                                    console.log("Clicky")
                                    setLoading(true)
                                    setTimeout(() => {
                                        setLoading(false)
                                    },5000)
                                }}
                                className="ui small primary button"
                            ><span>Save</span></LoadingButton>
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