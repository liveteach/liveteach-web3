import {Grid, TextField, Button, ButtonGroup, Modal} from "@mui/material";
import {useDispatch, useSelector} from "react-redux";
import {setNewClassReference, setNewClassDescription, setJwtToken} from "../../../store/teacherState";
import {NoAdmittance} from "../NoAdmittance";
import React, {useState} from "react";
import {AddFields} from "./additionalComponents/AddFields";
import {pinJSONToIPFS} from "../../../utils/pinata";
import {Typography} from "@material-ui/core";
import {SpecialActionsSection} from "./additionalComponents/SpecialActionsSection";
import {useHistory} from "react-router-dom";
import {setPendingTeachers} from "../../../store/classroomAdminState";

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

export function AddClass(props){

    const { newClassReference,newClassDescription, selectedClass,ipfsUrl, jwtToken } = useSelector((state) => state.teacher)
    const {roles} = useSelector((state) => state.adminUser)
    const render = roles.includes("teacher") || roles.includes("classroomAdmin")
    const dispatch = useDispatch()
    const imgVidObjectStructure = { src: "", caption: "", ratio: "" };
    const referenceLinksObjectStructure = { src: "", caption: "" };
    const modelObjectStructure = { src: "", position: { x: 0, y: 0, z: 0 }, scale: { x: 1,y: 1,z: 1 }, animations: [{clip: "", loop: false}], spin: false, replace: false }
    const pollStructure = { name: "", key: "poll", data: { title: "", options: [ "" ] }}
    const quizStructure = { name: "", key: "quiz", data: { question: "", options: [ "" ], answer: 0 }}
    const [open, setOpen] = useState(false)
    const [inputText, setInputText] = useState('');
    const [jsonObject, setJsonObject] = useState([]);
    const history = useHistory()

    const handleInputChange = (text) => {
        try {
            const parsedJson = JSON.parse(text);
            if (Array.isArray(parsedJson)) {
                setInputText(text);
                setJsonObject(parsedJson);
                alert("Successfully Added");
            } else {
                alert("This is valid JSON but not a JSON array");
            }
        } catch (error) {
            alert("This isn't a valid JSON");
            setJsonObject(null);
        }
    };


    const isValidJSON = (text) => {
        try {
            JSON.parse(text);
            return true;
        } catch (error) {
            return false;
        }
    };

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const [fields,setFields] = useState([{
        src: "",
        caption: "",
        ratio: 0.0
    }]);

    const [videoFields,setVideoFields] = useState([{
        src: "",
        caption: "",
        ratio: 0.0
    }]);

    const [referenceLinks, setReferenceLinks] = useState([{
        src: "",
        caption: ""
    }])

    const [model, setModel] = useState([{
        src: "",
        position: {
            x: 0,
            y: 0,
            z: 0
        },
        scale: {
            x: 1,
            y: 1,
            z: 1
        },
        animations: [
            {
                clip: "",
                loop: false
            }
        ],
        spin: false,
        replace: false
    }])

    const [poll, setPoll] = useState([{
        name: "",
        key: "poll",
        data: {
            title: "",
            options: [
                "",
            ]
        }
    }])

    const [quiz, setQuiz] = useState([{
        name: "",
        key: "quiz",
        data: {
            question: "",
            options: [
                "",
            ],
            answer: 0
        }
    }])

    const classTemplate = {
        pinataContent: {
        "content": {
            "id": selectedClass.id,
            "guid": selectedClass.guid,
            "name": newClassReference,
            "description": newClassDescription,
            "images": fields,
            "videos": videoFields,
            "models": model,
            "contentUnits": [...poll, ...quiz, ...jsonObject] ,
            "links": referenceLinks
        }},
        pinataMetadata: {name: newClassReference}
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

    const handlePublish = () => {

        document.getElementById("ipfsPending").style.display = 'block';

        pinJSONToIPFS(classTemplate, dispatch, jwtToken,newClassReference, "/teacher", history).then(response => {
            console.log(response)
        })
    }

    return (
        <div className="ui container">
            { render ? (
            <div className="ListingsTableContainer_listingsTableContainer__h1r2j ">
                <div className="ui container">
                    <div className="dcl tabs">
                        <div className="dcl tabs-left">
                            <h2>Setup Class</h2>
                        </div>
                        <div className="dcl tabs-right">
                            <Button
                                onClick={() => {
                                    handleOpen()
                                }}
                                className="ui small primary button"
                            >Publish</Button>
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
                <div id="ipfsPending" style={{ display:'none'}}>
                    <span  style={{color: 'green'}}>Pending..</span>
                </div>
                <div id="ipfsUrl" style={{display: 'none'}}>
                    <span style={{color:'#ff2d55', fontSize: '20px'}}>Copy this URL to use before navigating away:</span> <a rel="noreferrer" target="_blank" href={ipfsUrl} style={{color: 'green'}}>{ipfsUrl}</a>
                </div>
                <Grid container>
                <div className="ui container" style={{backgroundColor: '#37333d', padding: '20px', borderRadius: "10px"}}>
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
                </div>
                    <div className="ui container">
                        <div className="dcl tabs">
                            <h2>Images</h2>
                        </div>
                    </div>
                    <AddFields images={true} advanced={false} fields={fields} setFields={setFields} objStructure={imgVidObjectStructure}/>
                    <div className="ui container">
                        <div className="dcl tabs">
                            <h2>Videos</h2>
                        </div>
                    </div>
                    <AddFields images={false} advanced={false} fields={videoFields} setFields={setVideoFields} objStructure={imgVidObjectStructure}/>
                    <div className="ui container">
                        <div className="dcl tabs">
                            <h2>Models</h2>
                        </div>
                    </div>
                    <AddFields images={false} advanced={true} fields={model} setFields={setModel} objStructure={modelObjectStructure}/>
                    <div className="ui container">
                        <div className="dcl tabs">
                            <h2>Polls</h2>
                        </div>
                    </div>
                    <AddFields images={false} advanced={false} fields={poll} setFields={setPoll} objStructure={pollStructure}/>
                    <div className="ui container">
                        <div className="dcl tabs">
                            <h2>Quiz</h2>
                        </div>
                    </div>
                    <AddFields images={false} advanced={false} fields={quiz} setFields={setQuiz} objStructure={quizStructure}/>
                    <div className="ui container">
                        <div className="dcl tabs">
                            <h2>Reference Links</h2>
                        </div>
                    </div>
                    <AddFields images={false} fields={referenceLinks} setFields={setReferenceLinks} objStructure={referenceLinksObjectStructure}/>
                    <div className="ui container">
                        <div className="dcl tabs">
                            <h2>Special Actions</h2>
                        </div>
                    </div>
                    <SpecialActionsSection inputText={inputText} handleInputChange={handleInputChange} jsonObject={jsonObject}/>
                </Grid>
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
                            Please Enter your Pinata JWT
                        </Typography>
                        <div className="dcl modal-navigation-button modal-navigation-close" onClick={handleClose}>
                        </div>
                        <div style={{width: '80%', margin:'20px auto'}}  className="inputFields">
                            <TextField
                                fullWidth={true}
                                label="JWT"
                                className="textInput"
                                value={jwtToken}
                                onChange={(e) => {
                                    dispatch(setJwtToken(e.target.value))
                                }}
                            />
                        </div>

                        <div style={{margin: '15px'}}>
                            <Button

                                className="ui small primary button"
                                onClick={() => {
                                    handlePublish()
                                    handleClose()
                                }}
                            >
                                Publish
                            </Button>
                        </div>
                    </div>
                </div>
            </Modal>
        </div>
    )
}