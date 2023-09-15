
import {Link} from "react-router-dom";

export default function ClassroomAdmin(props){

    return(
        <div className="ui container">
            <div className="ListingsTableContainer_listingsTableContainer__h1r2j ">
                <div className="ui container">
                    <div className="dcl tabs">
                        <div className="dcl tabs-left">
                            <h4>Classrooms</h4>
                        </div>
                        <div className="dcl tabs-right">
                            <Link to="/classroomadmin/class">
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
                                <th>Classroom Name</th>
                                <th>ClassId</th>
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
            </div>
            <div className="ListingsTableContainer_listingsTableContainer__h1r2j ">
                <div className="ui container">
                    <div className="dcl tabs">
                        <div className="dcl tabs-left">
                            <h4>Teacher</h4>
                        </div>
                        <div className="dcl tabs-right">
                            <Link to="/classroomadmin/teacher">
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
                                <th>Teacher wallet</th>
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
            </div>

        </div>
    )
}