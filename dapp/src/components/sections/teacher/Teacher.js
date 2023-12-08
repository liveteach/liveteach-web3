import { useSelector} from "react-redux";
import {Link} from "react-router-dom";
import React, {useEffect, useState} from "react";

import {deleteClassConfig, getClassConfigs} from "../../../utils/interact";
import {Button} from "@mui/material";

export default function Teacher(props){

    const {pendingClass} = useSelector((state) => state.teacher)
    const {roles} = useSelector((state) => state.adminUser)
    const [classData, setClassData] = useState([{id:0, contentUrl:"", classReference:"", landIds:[]}]);

    useEffect(() => {
        console.log(roles)
        if(roles.includes("teacher")){
            getClassConfigs().then(result => {
                console.log("Class Configs")
                console.log(result)
                setClassData(result);
            })
        }
    },[roles,pendingClass])

    return(
        <div className="ui container">

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
            </div>
        </div>
    )
}