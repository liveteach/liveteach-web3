import {Grid, TextField, Button} from "@mui/material";
import {useDispatch, useSelector} from "react-redux";
import {setNewClassReference, setNewClassUrl} from "../../../store/teacherState";
import { createClassConfig } from "../../../utils/interact";
import {NoAdmittance} from "../NoAdmittance";

export function AddClass(props){

    const { newClassReference, newClassUrl } = useSelector((state) => state.teacher)
    const {roles} = useSelector((state) => state.adminUser)
    const render = roles.includes("teacher") || roles.includes("classroomAdmin")
    const dispatch = useDispatch()

    return (
        <div className="ui container">
            { render ? (
            <div className="ListingsTableContainer_listingsTableContainer__h1r2j ">
                <div className="ui container">
                    <div className="dcl tabs">
                        <div className="dcl tabs-left">
                            <h4>Add Class</h4>
                        </div>
                        <div className="dcl tabs-right">
                            <Button
                                onClick={() => {
                                    createClassConfig(newClassReference, newClassUrl).then(result => {
                                        console.log(result)
                                    })
                                }}
                                className="ui small primary button"
                            ><span>Add</span></Button>
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
                                value={newClassReference}
                                onChange={(e) => {
                                    dispatch(setNewClassReference(e.target.value))
                                }}
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
                                value={newClassUrl}
                                onChange={(e) => {
                                    dispatch(setNewClassUrl(e.target.value))
                                }}
                            />
                        </div>
                    </Grid>
                </Grid>
            </div>
            ) : (
                <NoAdmittance/>
            )}
        </div>
    )
}