import {Link} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {Button} from "@mui/material";
import {useEffect} from "react";
import { getClassrooms, deleteClassroom, getTeachers, deleteTeacher } from "../../../utils/interact";
import {setClassrooms, setTeachers} from "../../../store/classroomAdminState";
import {NoAdmittance} from "../NoAdmittance";

export default function ClassroomAdmin(props){

    const { classrooms, teachers } = useSelector((state) => state.classroomAdmin)
    const {roles} = useSelector((state) => state.adminUser)
    const render = roles.includes("classroomAdmin")

    const dispatch = useDispatch();

    useEffect(() => {
        if(render) {
            getClassrooms().then(result => {
                console.log(result)
                dispatch(setClassrooms(result))
            })
            getTeachers().then(result => {
                console.log(result)
                dispatch(setTeachers(result))
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
                                <th>Classroom Id</th>
                                <th>Classroom GUID</th>
                                <th></th>
                            </tr>

                            {
                                classrooms.map((item, index) => {
                                    return (
                                        <tr key={`Contributor_${index}`}>
                                            <td>
                                                {item.name}
                                            </td>
                                            <td>
                                                {item.id}
                                            </td>
                                            <td>
                                                {item.guid}
                                            </td>
                                            <td>
                                                <Button
                                                onClick={() =>{
                                                    deleteClassroom(item.id).then(result => {
                                                        console.log(result)
                                                    })
                                                }}>Remove</Button>
                                            </td>
                                        </tr>
                                    );
                                })
                            }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            ) : (
                <NoAdmittance/>
            )}
            { render ? (
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
                                teachers.map((item, index) => {
                                    return (
                                        <tr key={`Contributor_${index}`}>
                                            <td>
                                                {item.walletAddress}
                                            </td>
                                            <td>
                                                {item.classroomIds}
                                            </td>
                                            <td>
                                                <Button
                                                    onClick={() => {
                                                        deleteTeacher(item.walletAddress).then(result => {
                                                            console.log(result)
                                                        })
                                                    }}
                                                >Remove</Button>
                                            </td>
                                        </tr>
                                    );
                                })
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