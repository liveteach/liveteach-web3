import {useState} from "react";
import {Button, ButtonGroup, Grid, TextField} from "@mui/material";

export function PollCreation(props){

    function  handleAddOptions(parentIndex, array, func, objectStructure){
        const newObj = objectStructure
        const updatedModel = [...array]
        updatedModel[parentIndex].data.options = [...array[parentIndex].data.options, newObj]
        func(updatedModel)
    }

    function handleSubOptions(parentIndex, id, array, func) {
        const updatedModel = [...array];
        const options = [...array[parentIndex].data.options];
        if (options.length !== 1) {
            options.splice(id, 1);
            updatedModel[parentIndex].data.options = options;
            func(updatedModel);
        }
    }

    function handleChangeInput(i, e){
        const values = [...props.fields];
        values[i].data[e.target.name] = e.target.value;
        props.setFields(values);
    }

    function handleChangeInputOptions(parentIndex, i,e){
        const values = [...props.fields];

        values[parentIndex].data[e.target.name][i] = e.target.value;
        props.setFields(values);
    }

    return (
        <div>

            {
                props.field.data.hasOwnProperty("title") &&<div  style={{ width:"400%"}}> <Grid item xs={3}>
                    <div className={"jsonFields"}>
                        <h4>Title</h4>
                        <TextField
                            fullWidth={true}
                            className="textInput"
                            color="error"
                            value={props.field.data.title}
                            name="title"
                            onChange={e => handleChangeInput(props.index, e)}
                        />
                    </div>
                </Grid>
                    <h4>Options</h4>
                    {
                        props.field.data.options.map((item, itemIndex) => {
                            return <Grid container>
                                <h4>{String.fromCharCode(97 + itemIndex)}.</h4>
                                <Grid item xs={3}>
                                    <div className={"jsonFields"}>
                                        <h4>Option</h4>
                                        <TextField
                                            fullWidth={true}
                                            className="textInput"
                                            color="error"
                                            value={item}
                                            name="options"
                                            onChange={e => handleChangeInputOptions(props.index, itemIndex, e)}
                                        />
                                    </div>
                                </Grid>
                                <Grid item xs={3}>
                                    <div className={"jsonFields"}>
                                        <h4>Add/Remove Fields</h4>
                                        <ButtonGroup>
                                            <Button
                                                variant="contained"
                                                onClick={() => handleAddOptions(props.index, props.fields, props.setFields, "")}
                                            > + </Button>
                                            <Button
                                                variant="contained"
                                                onClick={() => handleSubOptions(props.index, itemIndex, props.fields, props.setFields)}
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
                props.field.data.hasOwnProperty("question") &&<div  style={{ width:"350%"}}> <Grid item xs={3}>
                    <div className={"jsonFields"}>
                        <h4>Question</h4>
                        <TextField
                            fullWidth={true}
                            className="textInput"
                            color="error"
                            value={props.field.data.question}
                            name="question"
                            onChange={e => handleChangeInput(props.index, e)}
                        />
                    </div>
                </Grid>
                    <h4>Answers</h4>
                    {
                        props.field.data.options.map((item, itemIndex) => {
                            return <Grid container>
                                <h4>{String.fromCharCode(97 + itemIndex)}.</h4>
                                <Grid item xs={3}>
                                    <div className={"jsonFields"}>
                                        <h4>Answers</h4>
                                        <TextField
                                            fullWidth={true}
                                            className="textInput"
                                            color="error"
                                            value={item}
                                            name="options"
                                            onChange={e => handleChangeInputOptions(props.index, itemIndex, e)}
                                        />
                                    </div>
                                </Grid>
                                <Grid item xs={3}>
                                    <div className={"jsonFields"}>
                                        <h4>Add/Remove Fields</h4>
                                        <ButtonGroup>
                                            <Button
                                                variant="contained"
                                                onClick={() => handleAddOptions(props.index, props.fields, props.setFields, "")}
                                            > + </Button>
                                            <Button
                                                variant="contained"
                                                onClick={() => handleSubOptions(props.index, itemIndex, props.fields, props.setFields)}
                                            > - </Button>
                                        </ButtonGroup>
                                    </div>
                                </Grid>
                            </Grid>
                        })
                    }
                    <h4>Correct Answer</h4>
                    {
                        <Grid item xs={3}>
                            <div className={"jsonFields"}>
                                <h4>Answer</h4>
                                <TextField
                                    fullWidth={true}
                                    className="textInput"
                                    color="error"
                                    value={props.field.data.answer}
                                    name="answer"
                                    onChange={e => handleChangeInput(props.index, e)}
                                />
                            </div>
                        </Grid>
                    }
                </div>
            }
        </div>
    );
}