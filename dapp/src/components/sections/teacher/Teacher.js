import {useDispatch, useSelector} from "react-redux";
import {Link} from "react-router-dom";
import React, {useEffect, useState} from "react";
import {setClassIds} from '../../../store/teacherState'
import {deleteClassConfig, getClassConfigs, getClassroom, getTeacher} from "../../../utils/interact";
import {Button} from "@mui/material";

export default function Teacher(props){

    const {pendingClass, classIds} = useSelector((state) => state.teacher)
    const {roles, walletAddress} = useSelector((state) => state.adminUser)
    const [classData, setClassData] = useState([{id:0, contentUrl:"", classReference:"", landIds:[]}]);
    const [data, setData] = useState([{guid: "", name: ""}])
    const [retrieved, setRetrieved] = useState(false);
    const dispatch = useDispatch()

    useEffect(() => {
            getClassConfigs().then(result => {
                if(result.length > 0){
                    setClassData(result);
                }
            })
    },[pendingClass,roles])

    useEffect(() => {
        if(roles.includes("teacher")){
            getTeacher(walletAddress).then(result => {
                if(result.classroomIds){
                    let ids = result.classroomIds
                    dispatch(setClassIds(ids))
                }

            })
        } else {
            if(classIds.length > 0 ){
                dispatch(setClassIds([]))
                setClassData([{id:0, contentUrl:"", classReference:"", landIds:[]}])
                setData([{guid: "", name: ""}])
            }
        }
    },[roles])

    useEffect(() => {
        if(classIds.length > 0 && !retrieved && roles.includes("teacher")) {
            getTeacherClassrooms().then(r => {
                let arr = []
                if(r.length > 0){
                    r.forEach(item => {
                        arr.push(item)
                    })
                    setData(arr)
                    setRetrieved(true)
                }

            })
        }
    },[classIds])

    async function getTeacherClassrooms() {
        const promises = classIds.map(async (classroom) => {
            return getClassroom(parseInt(classroom));
        })
        try {
            return await Promise.all(promises);
        } catch (error) {
            console.log('Failed to retrieve data:', error);
        }
    }

    return(
        <div className="ui container">

            <div className="ListingsTableContainer_listingsTableContainer__h1r2j ">
                <div className="ui container">
                    <div className="dcl tabs">
                        <div className="dcl tabs-left">
                            <h4>Content Manifests</h4>
                        </div>
                        <div className="dcl tabs-right">
                            <Link
                                to={"/teacher/add"}
                            ><button
                                onClick={() => console.log("Nav Clicked")}
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
                                <th>Id</th>
                                <th>Name</th>
                                <th>Content URL</th>
                                <th>Remove</th>
                            </tr>

                            {
                                classData.map((item, index) => {
                                        return (
                                            <tr key={`Contributor_${item}`}>
                                                <td>
                                                    {item.id}
                                                    <span style={{color:'green', display: 'none'}} id={`manifestRemove${index}`}>Pending..</span>
                                                </td>
                                                <td>
                                                    {item.classReference}
                                                </td>
                                                <td>
                                                    {item.contentUrl}
                                                </td>
                                                <td>
                                                <Button
                                                    onClick={() => {
                                                        let text = document.getElementById(`manifestRemove${index}`);
                                                        text.style.display = 'block'
                                                        deleteClassConfig(item.id).then(result => {
                                                            text.style.display = 'none'
                                                            getClassConfigs().then(result => {
                                                                console.log("Class Configs")
                                                                console.log(result)
                                                                setClassData(result);
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
                                pendingClass.map((item, index) => {
                                    if (item.name !== '' && item.status !== '') {
                                        return (
                                            <tr key={'class_config_pending_' + index}>
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
                {/*<Button>Show All</Button> | <Button>Show Active</Button> | <Button>Show inactive</Button>*/}
                {
                    data[0].guid !== "" && data[0].name !== "" ? (
                        <div className="ListingsTableContainer_listingsTableContainer__h1r2j ">
                            <div className="ui container">
                                <div className="dcl tabs">
                                    <div className="dcl tabs-left">
                                        <h4>Classes</h4>
                                    </div>
                                </div>
                            </div>
                                <div className="tableContainer">

                                <div className="TableContent">
                                    <table className="ui very basic table">

                                        <tbody>
                                        <tr>
                                            <th>GUID</th>
                                            <th>Name</th>
                                            <th>Link</th>
                                        </tr>

                                        {
                                            data.map((item, index) => {
                                                return (
                                                    <tr key={`ClassData_${item}`}>
                                                        <td>
                                                            {item.guid}
                                                        </td>
                                                        <td>
                                                            {item.name}
                                                        </td>
                                                        <td>
                                                           <a href={`https://play.decentraland.org/?realm=main&position=${item.landCoordinates[0]}`} target="_blank" rel="noreferrer">
                                                               https://play.decentraland.org/?realm=main&position={item.landCoordinates[0].join(",")}
                                                           </a>
                                                        </td>
                                                    </tr>
                                                )}
                                            )
                                        }
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                         ) : null
                }
            </div>
        </div>
    )
}