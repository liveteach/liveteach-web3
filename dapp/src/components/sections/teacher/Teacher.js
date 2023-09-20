import {Divider} from "decentraland-ui";
import {Button} from "@mui/material";
import {useSelector} from "react-redux";
import {Link} from "react-router-dom";

export default function Teacher(props){

    const {classNames, descriptions, classrooms} = useSelector((state) => state.teacher)
    return(
        <div className="ui container">
            <div className="ListingsTableContainer_listingsTableContainer__h1r2j ">
                <div className="ui container">
                    <div className="dcl tabs">
                        <div className="dcl tabs-left">
                            <h4>Classes</h4>
                        </div>
                        <div className="dcl tabs-right">
                            <Link to="/teacher/add">
                                <button
                                    className="ui small primary button"
                                >Add</button>
                            </Link>
                        </div>
                    </div>
                </div>
                <div className="tableContainer">

                    <div className="TableContent">
                        <table className="ui very basic table">

                            <tbody>
                            <tr>
                                <th>Class Name</th>
                                <th>Description</th>
                                <th>Classroom</th>
                                <th></th>
                            </tr>

                            {
                                classNames.map((item, index) => {
                                    return (
                                        <tr key={`Contributor_${index}`}>
                                            <td>
                                                {item}
                                            </td>
                                            <td>
                                                {descriptions[index]}
                                            </td>
                                            <td>
                                                {classrooms[index]}
                                            </td>
                                            <td>
                                                <Link to="/teacher/edit">
                                                    <Button
                                                        className="ui small basic button"
                                                        size="small"
                                                        variant="contained"
                                                    >Edit</Button>
                                                </Link>
                                            </td>
                                        </tr>
                                    );
                                })
                            }
                            </tbody>
                        </table>
                    </div>
                </div>
                <Button>Show All</Button> | <Button>Show Active</Button> | <Button>Show inactive</Button>
            </div>
        </div>
    )
}