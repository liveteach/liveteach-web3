import {Button} from "@mui/material";
import {useDispatch, useSelector} from "react-redux";
import {Link} from "react-router-dom";
import React, {useEffect, useState} from "react";

import {NoAdmittance} from "../NoAdmittance";
import {getClassConfigs, getClassroom, getTeacher} from "../../../utils/interact";
import {setClassIds, setSelectedClass} from "../../../store/teacherState";
import {setGuid} from "../../../store/classroomAdminState";

export default function Teacher(props){

    const {classIds} = useSelector((state) => state.teacher)
    const {roles,walletAddress} = useSelector((state) => state.adminUser)
    const render = roles.includes("teacher") || roles.includes("classroomAdmin")
    const dispatch = useDispatch()
    const [classData, setClassData] = useState([{id:0, guid:"", name:"", landIds:[]}]);

    useEffect(() => {
        const fetchClassData = async () => {
            const promises = classIds.map(async (classId) => {
                return await getClassroom(classId);
            });

            const classDataResults = await Promise.all(promises);
            setClassData(classDataResults);
        };

        fetchClassData();
    }, [classIds]);

    useEffect(() => {

            getTeacher(walletAddress).then(result => {
                console.log(result)
                dispatch(setClassIds(result.classroomIds))
            })
        getClassConfigs().then(result => {
            console.log("Class Configs")
            console.log(result)
        })
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
                            <Link
                                to={"/teacher/add"}
                            ><button
                                onClick={() => console.log("Eat My Shorts")}
                                className="ui small primary button"
                            >Add</button></Link>
                        </div>
                    </div>
                </div>
                <div className="tableContainer">

                    <div className="TableContent">
                        <table className="ui very basic table">

                            <tbody>
                            <tr>
                                <th>Name</th>
                                <th>Guid</th>
                                <th>Setup</th>
                            </tr>

                            {
                                classData.map((item, index) => {
                                        return (
                                            <tr key={`Contributor_${item}`}>
                                                <td>
                                                    {item.name}
                                                </td>
                                                <td>
                                                    {item.guid}
                                                </td>
                                                <td>
                                                    <Link
                                                        to={"/teacher/add"}
                                                    ><button
                                                        className="ui small primary button"
                                                        onClick={() => {
                                                            let ids = {name: "", id: item.id, guid: ""}
                                                            dispatch(setSelectedClass(ids))
                                                        }}
                                                    >Setup</button></Link>
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