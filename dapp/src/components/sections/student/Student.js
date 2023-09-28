import {Divider} from "decentraland-ui";
import {useSelector} from "react-redux";

export default function Student(props){

    const {roles} = useSelector((state) => state.adminUser)
    const render = roles.includes("student")

    return(
        <div className="ui container">
            { render ? (
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
                                <th>Location</th>
                                <th>Link</th>
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
            ) : (
                <div>
                    <p>you are not permitted to view this page</p>
                </div>
            )}
            {render ? (
            <div className="ListingsTableContainer_listingsTableContainer__h1r2j ">
                <h4>History</h4>
                <Divider />
                <div className="tableContainer">
                    <div className="TableContent">
                        <table className="ui very basic table">

                            <tbody>
                            <tr>
                                <th>Class Name</th>
                                <th>Description</th>
                                <th>Location</th>
                                <th>info</th>
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
                ) : (
                <div>
                </div>
                )}
        </div>
    )
}