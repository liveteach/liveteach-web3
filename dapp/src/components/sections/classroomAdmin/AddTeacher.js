import {Grid, MenuItem, Select, TextField} from "@mui/material";
import {getClassrooms, createTeacher, getTeachers} from "../../../utils/interact";
import {useDispatch, useSelector} from "react-redux";
import {useEffect} from "react";
import {setClassrooms, setPendingTeachers, setTeachers} from "../../../store/classroomAdminState";
import {setWalletAddress,setTeacherClassrooms} from "../../../store/teacherState";
import {NoAdmittance} from "../NoAdmittance";
import {useHistory} from "react-router-dom";

export function AddTeacher(props){

    const {walletAddress,teacherClassrooms} = useSelector((state) => state.teacher);
    const {classrooms} = useSelector((state) => state.classroomAdmin)
    const {roles} = useSelector((state) => state.adminUser)
    const render = roles.includes("classroomAdmin")
    const dispatch = useDispatch();
    const history = useHistory()

    useEffect(() => {
        if(render) {
            getClassrooms().then(result => {
                if (result.length > 0) {
                    dispatch(setClassrooms(result))
                }
            })
        }
    },[])

    return (
        <div className="ui container">
            { render ? (
            <div className="ListingsTableContainer_listingsTableContainer__h1r2j ">
                <div className="ui container">
                    <div className="dcl tabs">
                        <div className="dcl tabs-left">
                            <h4>Add Teacher</h4>
                        </div>
                        <div className="dcl tabs-right">
                            <button
                                onClick={() => {
                                    dispatch(setPendingTeachers([{name: walletAddress, status: "Pending.."}]))
                                    createTeacher(walletAddress,teacherClassrooms, "/classroomadmin", history).then(result => {

                                        let status = result.success ? "Success" : "Error"
                                        dispatch(setPendingTeachers([{name: walletAddress, status:status}]))

                                        setTimeout(() => {
                                            dispatch(setPendingTeachers([{name: "", status:""}]))
                                            getTeachers().then(result => {
                                                dispatch(setTeachers(result))
                                            })
                                        }, 1000)
                                    })
                            }}
                                className="ui small primary button"
                            >Add</button>
                        </div>
                    </div>
                </div>
                <Grid container>
                    <Grid item xs={6}>
                        <div className={"teacherFields"}>
                            <h4>Wallet Address</h4>
                            <TextField
                                fullWidth={true}
                                className="textInput"
                                value={walletAddress}
                                onChange={(e) => {
                                    dispatch(setWalletAddress(e.target.value));
                                }}
                                color="error"
                            />
                        </div>
                    </Grid>
                    <Grid item xs={6}>
                        <div className={"teacherFields"}>
                            <h4>Class</h4>
                            <Select
                                className="selectMenu"
                                fullWidth={true}
                                id="selectMenuAddTeacher"
                                multiple
                                value={teacherClassrooms}
                                onChange={(e) => {
                                    dispatch(setTeacherClassrooms(e.target.value))
                                }}
                            >
                                {
                                    classrooms.map(item => {
                                        return <MenuItem
                                                className="selectItem"
                                                value={item.id}
                                                key={`${item.name + item.id}`}
                                            >{item.name}</MenuItem>
                                    })
                                }
                            </Select>
                        </div>
                    </Grid>
                </Grid>
            </div>
            ) : (
                <NoAdmittance/>
            )}
        </div>
    )
}