import {Link} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {Button} from "@mui/material";
import React, {useEffect} from "react";
import { getClassrooms, deleteClassroom, getTeachers, deleteTeacher } from "../../../utils/interact";
import {setClassrooms, setTeachers} from "../../../store/classroomAdminState";
import {NoAdmittance} from "../NoAdmittance";

export default function ClassroomAdmin(props){

    const { classrooms, teachers, pendingTeachers, pendingClassrooms } = useSelector((state) => state.classroomAdmin)
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
                                <th>Classroom Coords</th>
                                <th>Classroom GUID</th>
                                <th></th>
                            </tr>

                            {
                                classrooms.map((item, index) => {
                                    return (
                                        <tr key={`Contributor_${index}`}>
                                            <td>
                                                {item.name}
                                                <span style={{color:'green', display: 'none'}} id={`classroomRemove${index}`}>Pending..</span>
                                            </td>
                                            <td>
                                                {item.id}
                                            </td>
                                            <td>
                                                {item["landCoordinates"] && Array.isArray(item["landCoordinates"]) ? (
                                                    <div className="coordinates-container">
                                                        {item["landCoordinates"]
                                                            .map((coords, index) => (
                                                                <span key={index} className="coordinate-item">
                                                                    {index < 2 ? `(${coords[0]},${coords[1]})` : ''}
                                                                    {index === 1 && item["landCoordinates"].length > 2 && (
                                                                                                                    <span className="tooltip">
                                                                            {item["landCoordinates"].map((coords, i) => `(${coords[0]},${coords[1]})`).join("  ")}
                                                                        </span>
                                                                    )}
                                                                </span>
                                                            ))}..
                                                    </div>
                                                ) : (
                                                    <div>Coordinates not available</div>
                                                )}
                                            </td>
                                            <td>
                                                {item.guid}
                                            </td>
                                            <td>
                                                <Button
                                                onClick={() =>{
                                                    let text = document.getElementById(`classroomRemove${index}`);
                                                    text.style.display = 'block'
                                                    deleteClassroom(item.id).then(result => {
                                                        text.style.display = 'none'
                                                        getClassrooms().then(result => {
                                                            dispatch(setClassrooms(result))
                                                        })
                                                    })
                                                }}>Remove</Button>
                                            </td>
                                        </tr>
                                    );
                                })
                            }
                            {
                                pendingClassrooms.map((item, index) => {
                                    if (item.name !== '' && item.status !== '') {
                                        return (
                                            <tr key={'classroom_pending_' + index}>
                                                <td>{item.name}</td>
                                                <td>
                                                    <span style={{ color: 'green' }}>{item.status}</span>
                                                </td>
                                            </tr>
                                        );
                                    } else {
                                        return null;
                                    }
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
                                                {item.walletAddress }
                                                <span style={{color:'green', display: 'none'}} id={`teacherRemove${index}`}>Pending..</span>
                                            </td>
                                            <td>
                                                {item.classroomIds}
                                            </td>
                                            <td>
                                                <Button
                                                    onClick={() => {
                                                        let text = document.getElementById(`teacherRemove${index}`);
                                                        text.style.display = 'block'
                                                        deleteTeacher(item.walletAddress).then(result => {
                                                            text.style.display = 'none'
                                                            getTeachers().then(result => {
                                                                console.log(result)
                                                                dispatch(setTeachers(result))
                                                            })
                                                            console.log(result)
                                                        })
                                                    }}
                                                >Remove</Button>
                                            </td>
                                        </tr>
                                    );
                                })
                            }
                            {
                                pendingTeachers.map((item, index) => {
                                    if (item.name !== '' && item.status !== '') {
                                        return (
                                            <tr key={'teacher_pending_' + index}>
                                                <td>{item.name}</td>
                                                <td>
                                                    <span style={{ color: 'green' }}>{item.status}</span>
                                                </td>
                                            </tr>
                                        );
                                    } else {
                                        return null;
                                    }
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