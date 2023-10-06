import {Button, ButtonGroup, Grid, TextField} from "@mui/material";

export function AddFields(props){

    function handleChangeInput(i, e){
        const values = [...props.fields];
        values[i][e.target.name] = e.target.value;
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
        <div className="ui container">
            {
                props.fields.map((field, index) => {

                    return <Grid container>
                        <Grid item xs={4}>
                            <div className={"jsonFields"}>
                                <h4>{field.hasOwnProperty("src") ? "Source" : "Key"}</h4>
                                <TextField
                                    fullWidth={true}
                                    className="textInput"
                                    color="error"
                                    value={field.hasOwnProperty("src") ? field.src : field.key}
                                    name={field.hasOwnProperty("src") ? "src" : "key"}
                                    onChange={e => handleChangeInput(index, e)}
                                />
                            </div>
                        </Grid>
                        {
                            field.hasOwnProperty("caption") &&  <Grid item xs={4}>
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

                        <Grid item xs={4}>
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
                    </Grid>
                })
            }
        </div>
    )
}