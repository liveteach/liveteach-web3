import {Button, ButtonGroup, Grid, TextField} from "@mui/material";
import Divider from '@mui/material/Divider';
import {PollCreation} from "./PollCreation";
import {PinFilesToIPFS} from "./PinFilesToIPFS";
import {useEffect, useState} from "react";
import {AdvancedModelSection} from "./AdvancedModelSection";

export function AddFields(props){

    const [open, setOpen] = useState(false)

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
                            field.hasOwnProperty("name") &&  <Grid item xs={3}>
                                <div className={"jsonFields"}>
                                    <h4>Name</h4>
                                    <TextField
                                        fullWidth={true}
                                        className="textInput"
                                        color="error"
                                        name="name"
                                        value={field.name}
                                        onChange={e => handleChangeInput(index, e)}
                                    />
                                </div>

                            </Grid>
                        }

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
                            field.hasOwnProperty("data") && <PollCreation index={index} field={field} fields={props.fields} setFields={props.setFields} objStructure={props.objStructure}/>
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
                            field.hasOwnProperty("position") && <AdvancedModelSection
                                images={props.images}
                                advanced={props.advanced}
                                fields={props.fields}
                                field={field}
                                setFields={props.setFields}
                                objStructure={props.objStructure}
                                index={index}/>
                        }


                        <Divider />

                    </Grid>
                })
            }
        </div>
    )
}