import {Button, ButtonGroup, Grid, TextField} from "@mui/material";
import Divider from '@mui/material/Divider';
import {PollCreation} from "./PollCreation";
import {PinFilesToIPFS} from "./PinFilesToIPFS";
import React, {useState} from "react";

export function AddFields(props){

    const animationObjectStructure = {clip: "", loop: false}
    const [open, setOpen] = useState(false)

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

    function handleChangeInput(i, e){
        const values = [...props.fields];
        values[i][e.target.name] = e.target.value;
        props.setFields(values);
    }

    function handleCheckbox(i, e){
        const values = [...props.fields];
        values[i][e.target.name] = e.target.checked;
        props.setFields(values);
    }

    function handlePositionAndScale(i,e){
        let pos = e.target.name.split(".")
        const values =[...props.fields];
        values[i][pos[0]][pos[1]] = parseFloat(e.target.value)
        props.setFields(values)
    }

    function handleAdd(index,array,func, objectStructure){
        const newObj = { ...objectStructure };
        func([...array, newObj]);
    }

    function handleSub(id,array,func){
        const values = [...array];
        if(values.length !== 1 ){
            values.splice(id,1);
            func(values);
        }
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
        <div className="ui container" style={{backgroundColor: '#37333d', padding: '20px', borderRadius: "10px"}}>
            {
                props.fields.map((field, index) => {

                    return <Grid key={"addfields" + index} container>

                        <Grid item xs={12}>
                            {
                                index >= 1 ? <Divider light={true} style={{ backgroundColor: '#ff2d55 ' }}/> : null
                            }
                            <h4>{index +1}.</h4>
                        </Grid>

                        {
                            field.hasOwnProperty("src") && <Grid item xs={3}>
                                <div className={"jsonFields"}>
                                    <h4>Source</h4>
                                    <TextField
                                        fullWidth={true}
                                        className="textInput"
                                        color="error"
                                        value={field.src}
                                        name="src"
                                        onChange={e => handleChangeInput(index, e)}
                                        key={`textfield-${field.src}`}
                                    />
                                    {
                                        props.images ? <PinFilesToIPFS
                                            src={field.src}
                                            open={open}
                                            setOpen={setOpen}
                                            fields={props.fields}
                                            setFields={props.setFields}
                                            index={index}
                                            handleChangeInput={handleChangeInput}
                                        /> : null
                                    }
                                    <div id={"ipfsFilePending" + index} style={{ display:'none'}}>
                                        <span  style={{color: 'green'}}>Pending..</span>
                                    </div>
                                </div>
                            </Grid>
                        }
                        {
                            field.hasOwnProperty("caption") &&  <Grid item xs={3}>
                                <div className={"jsonFields"}>
                                    <h4>Caption</h4>
                                    <TextField
                                        fullWidth={true}
                                        className="textInput"
                                        color="error"
                                        name="caption"
                                        value={field.caption}
                                        onChange={e => handleChangeInput(index, e)}
                                    />
                                </div>
                            </Grid>
                        }
                        {
                            field.hasOwnProperty("ratio") &&  <Grid item xs={3}>
                                <div className={"jsonFields"}>
                                    <h4>Ratio</h4>
                                    <TextField
                                        fullWidth={true}
                                        className="textInput"
                                        color="error"
                                        name="ratio"
                                        type="number"
                                        value={field.ratio}
                                        onChange={e => handleChangeInput(index, e)}
                                    />
                                </div>
                            </Grid>
                        }
                        {
                            field.hasOwnProperty("spin") &&  <Grid item xs={3}>
                                <div className={"jsonFields"}>
                                    <h4>Spin</h4>
                                    <input
                                        type="checkbox"
                                        checked={field.spin}
                                        name="spin"
                                        onChange={(e) => {
                                            handleCheckbox(index,e)
                                        }}
                                    />
                                </div>
                            </Grid>
                        }
                        {
                            field.hasOwnProperty("replace") &&  <Grid item xs={3}>
                                <div className={"jsonFields"}>
                                    <h4>Replace</h4>
                                    <input
                                        type="checkbox"
                                        checked={field.replace}
                                        name="replace"
                                        onChange={(e) => {
                                            handleCheckbox(index,e)
                                        }}
                                    />
                                </div>
                            </Grid>
                        }
                        {
                            field.hasOwnProperty("data") && <PollCreation index={index} field={field} fields={props.fields} setFields={props.setFields} objStructure={props.objStructure}/>
                        }
                        <Grid item xs={3}>
                            <div className={"jsonFields"}>
                                <h4>Add/Remove Fields</h4>
                                <ButtonGroup>
                                    <Button
                                        variant="contained"
                                        onClick={() => handleAdd(index,props.fields,props.setFields, props.objStructure)}
                                    > + </Button>
                                    <Button
                                        variant="contained"
                                        onClick={() => handleSub(index,props.fields,props.setFields, props.objStructure)}
                                    > - </Button>
                                </ButtonGroup>
                            </div>
                        </Grid>
                        {
                            field.hasOwnProperty("position") && <div style={{ width:"50%"}}>
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
                                        value={field.position.x}
                                        onChange={e => handlePositionAndScale(index, e)}
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
                                        value={field.position.y}
                                        onChange={e => handlePositionAndScale(index, e)}
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
                                        value={field.position.z}
                                        onChange={e => handlePositionAndScale(index, e)}
                                    />
                                    </div>
                                </Grid>
                            </Grid>
                            <h4>Animations:</h4>
                                {
                                    field.animations.map((field, indexAnim) => {
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
                                                            onChange={e => handleChangeAnimationInput(index, indexAnim, e)}
                                                        />
                                                    </div>
                                                </Grid>
                                            }
                                            {
                                                field.hasOwnProperty("loop") && <Grid item xs={6}>
                                                    <div className={"jsonFields"}>
                                                        <h4>Loop</h4>
                                                        <input
                                                            type="checkbox"
                                                            checked={field.loop}
                                                            name="loop"
                                                            onChange={(e) => {
                                                                handleAnimationCheckbox(index, indexAnim, e)
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
                                                            onClick={() => handleAddAnimation(index, props.fields, props.setFields, animationObjectStructure)}
                                                        > + </Button>
                                                        <Button
                                                            variant="contained"
                                                            onClick={() => handleSubAnimation(index, indexAnim, props.fields, props.setFields)}
                                                        > - </Button>
                                                    </ButtonGroup>
                                                </div>
                                            </Grid>
                                        </Grid>
                                    })
                                }
                            </div>
                        }
                        {
                            field.hasOwnProperty("scale") && <div style={{ width:"50%"}}>
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
                                                value={field.scale.x}
                                                onChange={e => handlePositionAndScale(index, e)}
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
                                                value={field.scale.y}
                                                onChange={e => handlePositionAndScale(index, e)}
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
                                                value={field.scale.z}
                                                onChange={e => handlePositionAndScale(index, e)}
                                            />
                                        </div>
                                    </Grid>
                                </Grid>
                            </div>
                        }


                        <Divider />

                    </Grid>
                })
            }
        </div>
    )
}