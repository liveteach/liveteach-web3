import {Button} from "@mui/material";
import {useDispatch, useSelector} from "react-redux";
import {Link} from "react-router-dom";
import {useEffect} from "react";
import {getClassConfigs} from "../../../utils/interact";
import {setClassConfigs,setSelectedClass} from "../../../store/teacherState";
import {NoAdmittance} from "../NoAdmittance";

export default function Teacher(props){

    const {classConfigs} = useSelector((state) => state.teacher)
    const {roles} = useSelector((state) => state.adminUser)
    const render = roles.includes("teacher") || roles.includes("classroomAdmin")
    const dispatch = useDispatch()


    useEffect(() => {
        console.log(roles)
        if(roles.includes("teacher")){
            getClassConfigs().then(result => {
                dispatch(setClassConfigs(result))
            })
        }
    },[])

    return(
        <div className="ui container">
            { render ? (
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
                                <th>URL</th>
                                <th>Class Reference</th>
                                <th></th>
                            </tr>

                            {
                                classConfigs.map((item, index) => {
                                    return (
                                        <tr key={`Contributor_${index}`}>
                                            <td>
                                                <a href={item.contentUrl}>{item.contentUrl}</a>
                                            </td>
                                            <td>
                                                {item.classReference}
                                            </td>
                                            <td>
                                                <Link to="/teacher/edit">
                                                    <Button
                                                        className="ui small basic button"
                                                        size="small"
                                                        variant="contained"
                                                        onClick={() => {
                                                            dispatch(setSelectedClass(item))
                                                        }}
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
                ) : (
                <NoAdmittance/>
            )}
        </div>
    )
}