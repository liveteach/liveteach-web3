import {Grid, MenuItem, Select, TextField} from "@mui/material";

export function AddClass(props){
    return (
        <div className="ui container">
            <div className="ListingsTableContainer_listingsTableContainer__h1r2j ">
                <div className="ui container">
                    <div className="dcl tabs">
                        <div className="dcl tabs-left">
                            <h4>Add Class</h4>
                        </div>
                    </div>
                </div>
                <Grid container>
                    <Grid item xs={8}>
                        <div className={"inputFields"}>
                            <h4>Name</h4>
                            <TextField
                                fullWidth={true}
                                className="textInput"
                                color="error"
                            />
                        </div>
                    </Grid>
                    <Grid item xs={4}>
                        <div className={"inputFields"}>
                            <h4>Location</h4>
                            <Select className="selectMenu" fullWidth={true}>
                                <MenuItem className="selectItem">Class 1</MenuItem>
                                <MenuItem className="selectItem">Class 2</MenuItem>
                                <MenuItem className="selectItem">Class 3</MenuItem>
                            </Select>
                        </div>
                    </Grid>
                </Grid>
            </div>
        </div>
    )
}