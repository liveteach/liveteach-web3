import {Grid, TextField, Button, ButtonGroup} from "@mui/material";
import {useDispatch, useSelector} from "react-redux";
import {setNewClassReference, setNewClassDescription} from "../../../store/teacherState";
import {NoAdmittance} from "../NoAdmittance";
import {useState} from "react";
import {AddFields} from "./additionalComponents/AddFields";

export function AddClass(props){

    const { newClassReference, newClassDescription } = useSelector((state) => state.teacher)
    const {roles} = useSelector((state) => state.adminUser)
    const render = roles.includes("teacher") || roles.includes("classroomAdmin")
    const dispatch = useDispatch()
    const imgVidObjectStructure = { src: "", caption: "" };
    const modelObjectStructure = { key: "" }

    const [fields,setFields] = useState([{
        src: "",
        caption: ""
    }]);
    const [videoFields,setVideoFields] = useState([{
        src: "",
        caption: ""
    }]);
    const [model, setModel] = useState([{
        key:""
    }])

    const classTemplate = {
        "content": {
            "id": "",
            "name": newClassReference,
            "description": newClassDescription,
            "images": fields,
            "videos": videoFields,
            "models": model
        }
        };

    const handleDownload = () => {
        const jsonData = JSON.stringify(classTemplate, null, 2);
        const blob = new Blob([jsonData], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = 'new_class.json';

        a.click();

        URL.revokeObjectURL(url);
    };


    return (
        <div className="ui container">
            { render ? (
            <div className="ListingsTableContainer_listingsTableContainer__h1r2j ">
                <div className="ui container">
                    <div className="dcl tabs">
                        <div className="dcl tabs-left">
                            <h4>Setup Class</h4>
                        </div>
                        <div className="dcl tabs-right">
                            <Button
                                onClick={() => {
                                    handleDownload()
                                }}
                                className="ui small primary button"
                            ><span>download json</span></Button>
                        </div>
                    </div>
                </div>
                <Grid container>
                    <Grid item xs={12}>
                        <div className={"inputFields"}>
                            <h4>Name</h4>
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
                    <Grid item xs={12}>
                        <div className={"inputFields"}>
                            <h4>Description</h4>
                            <TextField
                                fullWidth={true}
                                className="textInput"
                                color="error"
                                value={newClassDescription}
                                onChange={(e) => {
                                    dispatch(setNewClassDescription(e.target.value))
                                }}
                            />
                        </div>
                    </Grid>
                    <div className="ui container">
                        <div className="dcl tabs">
                            <h3>Images</h3>
                        </div>
                    </div>
                    <AddFields fields={fields} setFields={setFields} objStructure={imgVidObjectStructure}/>
                    <div className="ui container">
                        <div className="dcl tabs">
                            <h3>Videos</h3>
                        </div>
                    </div>
                    <AddFields fields={videoFields} setFields={setVideoFields} objStructure={imgVidObjectStructure}/>
                    <div className="ui container">
                        <div className="dcl tabs">
                            <h3>Models</h3>
                        </div>
                    </div>
                    <AddFields fields={model} setFields={setModel} objStructure={modelObjectStructure}/>
                </Grid>
            </div>
            ) : (
                <NoAdmittance/>
            )}
        </div>
    )
}