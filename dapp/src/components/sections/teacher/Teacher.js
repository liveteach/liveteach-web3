import DateAndTimePicker from "../../elements/DateAndTimePicker";
import {Divider} from "decentraland-ui";
import {Button} from "@mui/material";

export default function Teacher(props){
    return(
        <div className="ui container">
            <div className="ListingsTableContainer_listingsTableContainer__h1r2j ">
                <h4>Enrolments</h4>
                <Divider />
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
                                // sceneIds.map((item, index) => {
                                //     return (
                                //         <tr key={`Contributor_${index}`}>
                                //             {/*<td>*/}
                                //             {/*    <input type="checkbox"/>*/}
                                //             {/*</td>*/}
                                //             <td>
                                //                 {item}
                                //             </td>
                                //             <td>
                                //                 {coordinates[index]}
                                //             </td>
                                //         </tr>
                                //     );
                                // })
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