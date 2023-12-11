import {Button, ButtonGroup, Grid, TextField} from "@mui/material";
import {useEffect, useState} from "react";

export function AdvancedModelSection(props){


    const animationObjectStructure = {clip: "", loop: false}
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [show,setShow] = useState("+")

    useEffect(()=> {
        if(showAdvanced){
            setShow("-")
        } else {
            setShow("+")
        }
    },[showAdvanced])

    const toggleAdvanced = () => {
        setShowAdvanced(!showAdvanced);

    };

    function handleChangeAnimationInput(index,indexAnim, e){
        const values = [...props.fields];
        values[index].animations[indexAnim][e.target.name] = e.target.value;
        props.setFields(values);
    }

    function handleAnimationCheckbox(index,indexAnim, e){
        const values = [...props.fields];
        values[index].animations[indexAnim][e.target.name] = e.target.checked;
        props.setFields(values);
    }

    function handlePositionAndScale(i,e){
        let pos = e.target.name.split(".")
        const values =[...props.fields];
        values[i][pos[0]][pos[1]] = parseFloat(e.target.value)
        props.setFields(values)
    }


    function handleAddAnimation(parentIndex, array, func, objectStructure) {
        const newObj = { ...objectStructure };
        const updatedModel = [...array];
        updatedModel[parentIndex].animations = [...array[parentIndex].animations, newObj];
        func(updatedModel);
    }

    function handleSubAnimation(parentIndex, id, array, func) {
        const updatedModel = [...array];
        const animations = [...array[parentIndex].animations];
        if (animations.length !== 1) {
            animations.splice(id, 1);
            updatedModel[parentIndex].animations = animations;
            func(updatedModel);
        }
    }

    return(
        <div style={{width: '200%'}}>
            {
                props.advanced ? <div className="accordion" id="textContainer" onClick={toggleAdvanced}><span
                    className="startText">Advanced</span>
                    <span className="endText">{show}</span>
                </div> : null
            }
            <Grid container>
            {
                props.field.hasOwnProperty("position") && <div style={{ width:"50%"}}>

                    {showAdvanced && (
                        <div>
                            <h4>Position: </h4>
                            <Grid container>

                                <Grid item xs={3}>
                                    <div className={"jsonFields"}>
                                        <h4>X</h4>
                                        <TextField
                                            fullWidth={true}
                                            className="textInput"
                                            color="error"
                                            name="position.x"
                                            type="number"
                                            size="small"
                                            value={props.field.position.x}
                                            onChange={e => handlePositionAndScale(props.index, e)}
                                        />
                                    </div>
                                </Grid>
                                <Grid item xs={3}>
                                    <div className={"jsonFields"}>
                                        <h4>Y</h4>
                                        <TextField
                                            fullWidth={true}
                                            className="textInput"
                                            color="error"
                                            name="position.y"
                                            type="number"
                                            size="small"
                                            value={props.field.position.y}
                                            onChange={e => handlePositionAndScale(props.index, e)}
                                        />
                                    </div>
                                </Grid>
                                <Grid item xs={3}>
                                    <div className={"jsonFields"}>
                                        <h4>Z</h4>
                                        <TextField
                                            fullWidth={true}
                                            className="textInput"
                                            color="error"
                                            name="position.z"
                                            type="number"
                                            size="small"
                                            value={props.field.position.z}
                                            onChange={e => handlePositionAndScale(props.index, e)}
                                        />
                                    </div>
                                </Grid>
                            </Grid>
                            <h4>Animations:</h4>
                            {
                                props.field.animations.map((field, indexAnim) => {
                                    return <Grid container>
                                        <h4>{String.fromCharCode(97 + indexAnim)}.</h4>
                                        {
                                            field.hasOwnProperty("clip") && <Grid item xs={6}>
                                                <div className={"jsonFields"}>
                                                    <h4>Clip</h4>
                                                    <TextField
                                                        fullWidth={true}
                                                        className="textInput"
                                                        color="error"
                                                        name="clip"
                                                        value={field.clip}
                                                        onChange={e => handleChangeAnimationInput(props.index, indexAnim, e)}
                                                    />
                                                </div>
                                            </Grid>
                                        }
                                        {
                                            <Grid item xs={6}>
                                                <div className={"jsonFields"}>
                                                    <h4>Loop</h4>
                                                    <input
                                                        type="checkbox"
                                                        checked={field.loop}
                                                        name="loop"
                                                        onChange={(e) => {
                                                            handleAnimationCheckbox(props.index, indexAnim, e)
                                                        }}
                                                    />
                                                </div>
                                            </Grid>
                                        }
                                        <Grid item xs={3}>
                                            <div className={"jsonFields"}>
                                                <h4>Add/Remove Fields</h4>
                                                <ButtonGroup>
                                                    <Button
                                                        variant="contained"
                                                        onClick={() => handleAddAnimation(props.index, props.fields, props.setFields, animationObjectStructure)}
                                                    > + </Button>
                                                    <Button
                                                        variant="contained"
                                                        onClick={() => handleSubAnimation(props.index, indexAnim, props.fields, props.setFields)}
                                                    > - </Button>
                                                </ButtonGroup>
                                            </div>
                                        </Grid>
                                    </Grid>
                                })
                            }
                        </div>  )}
                </div>
            }
            {
                props.field.hasOwnProperty("scale") && <div style={{ width:"50%"}}>
                    {showAdvanced && (
                        <div>
                            <h4>Scale: </h4>
                            <Grid container>
                                <Grid item xs={3}>
                                    <div className={"jsonFields"}>
                                        <h4>X</h4>
                                        <TextField
                                            fullWidth={true}
                                            className="textInput"
                                            color="error"
                                            name="scale.x"
                                            type="number"
                                            size="small"
                                            value={props.field.scale.x}
                                            onChange={e => handlePositionAndScale(props.index, e)}
                                        />
                                    </div>
                                </Grid>
                                <Grid item xs={3}>
                                    <div className={"jsonFields"}>
                                        <h4>Y</h4>
                                        <TextField
                                            fullWidth={true}
                                            className="textInput"
                                            color="error"
                                            name="scale.y"
                                            type="number"
                                            size="small"
                                            value={props.field.scale.y}
                                            onChange={e => handlePositionAndScale(props.index, e)}
                                        />
                                    </div>
                                </Grid>
                                <Grid item xs={3}>
                                    <div className={"jsonFields"}>
                                        <h4>Z</h4>
                                        <TextField
                                            fullWidth={true}
                                            className="textInput"
                                            color="error"
                                            name="scale.z"
                                            type="number"
                                            size="small"
                                            value={props.field.scale.z}
                                            onChange={e => handlePositionAndScale(props.index, e)}
                                        />
                                    </div>
                                </Grid>
                            </Grid>
                        </div>  )}
                </div>
            }
            </Grid>
        </div>
    )
}