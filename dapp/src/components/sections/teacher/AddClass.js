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
                        <div className="dcl tabs-right">
                            <button
                                onClick={() => {
                                    console.log("Clicky")

                                }}
                                className="ui small primary button"
                            >Add Class</button>
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
                <Grid item xs={8}>
                    <div className="inputFields">
                        <h4>Description</h4>
                        <TextField
                            multiline
                            fullWidth={true}
                            className="textInput"
                            color="error"
                        />
                    </div>
                </Grid>
            </div>
            <div>
                <div className="ui container">
                    <div className="dcl tabs">
                        <div className="dcl tabs-left">
                            <h4>Enrollments</h4>
                        </div>
                        <div className="dcl tabs-right">
                            <button
                                onClick={() => {
                                    console.log("Clicky")

                                }}
                                className="ui small primary button"
                            >Add</button>
                        </div>
                    </div>
                </div>
                <div className="tableContainer">
                    <div className="TableContent">
                        <table className="ui very basic table">
                            <tbody>
                            <tr>
                                <th>Name</th>
                            </tr>

                            {/*{*/}
                            {/*    classNames.map((item, index) => {*/}
                            {/*        return (*/}
                            {/*            <tr key={`Contributor_${index}`}>*/}
                            {/*                <td>*/}
                            {/*                    {item}*/}
                            {/*                </td>*/}
                            {/*                <td>*/}
                            {/*                    {descriptions[index]}*/}
                            {/*                </td>*/}
                            {/*                <td>*/}
                            {/*                    {classrooms[index]}*/}
                            {/*                </td>*/}
                            {/*                <td>*/}
                            {/*                    <Link to="/teacher/edit">*/}
                            {/*                        <Button*/}
                            {/*                            className="ui small basic button"*/}
                            {/*                            size="small"*/}
                            {/*                            variant="contained"*/}
                            {/*                        >Edit</Button>*/}
                            {/*                    </Link>*/}
                            {/*                </td>*/}
                            {/*            </tr>*/}
                            {/*        );*/}
                            {/*    })*/}
                            {/*}*/}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}