// import {Grid, TextField,Button} from "@mui/material";
// import {useDispatch, useSelector} from "react-redux";
// import {deleteClassConfig, updateClassConfig} from "../../../utils/interact";
// import {setNewClassUrl, setNewClassReference} from "../../../store/teacherState";
// import {NoAdmittance} from "../NoAdmittance";
//
// export function EditClass(props){
//
//     const { selectedClass, newClassReference, newClassUrl } = useSelector((state) => state.teacher)
//     const {roles} = useSelector((state) => state.adminUser)
//     const render = roles.includes("teacher") || roles.includes("classroomAdmin")
//     const dispatch = useDispatch()
//
//     return (
//         <div className="ui container">
//             { render ? (
//             <div className="ListingsTableContainer_listingsTableContainer__h1r2j ">
//                 <div className="ui container">
//                     <div className="dcl tabs">
//                         <div className="dcl tabs-left">
//                             <h4>Edit Class</h4>
//                         </div>
//                         <div className="dcl tabs-right">
//                             <Button
//                                 onClick={() => {
//                                     console.log(selectedClass.id,selectedClass.classReference, selectedClass.contentUrl)
//                                     let id = parseInt(selectedClass.id)
//                                     updateClassConfig(id,selectedClass.classReference, selectedClass.contentUrl).then(result =>{
//                                         console.log(result)
//                                     })
//                                 }}
//                                 className="ui small primary button"
//                             >update</Button>
//                         </div>
//                         <div className="dcl tabs-right">
//                             <Button
//                                 onClick={() => {
//                                     let id = parseInt(selectedClass.id)
//                                     deleteClassConfig(id).then(result => {
//                                         console.log(result)
//                                     })
//                                 }}
//                                 className="ui small primary button"
//                             >Delete</Button>
//                         </div>
//                     </div>
//                 </div>
//                 <Grid container>
//                     <Grid item xs={8}>
//                         <div className={"inputFields"}>
//                             <h4>Class Config Reference</h4>
//                             <p>Current: <span style={{color: 'grey'}}>{selectedClass.classReference}</span></p>
//                             <TextField
//                                 fullWidth={true}
//                                 className="textInput"
//                                 color="error"
//                                 value={newClassReference}
//                                 onChange={(e) => {
//                                         dispatch(setNewClassReference(e.target.value))
//                                 }}
//                             />
//                         </div>
//                     </Grid>
//                     <Grid item xs={8}>
//                         <div className={"inputFields"}>
//                             <h4>Class Configuration</h4>
//                             <p>Current: <span style={{color: 'grey'}}>{selectedClass.contentUrl}</span></p>
//                             <TextField
//                                 fullWidth={true}
//                                 className="textInput"
//                                 color="error"
//                                 value={newClassUrl}
//                                 onChange={(e) => {
//                                     dispatch(setNewClassUrl(e.target.value))
//                                 }}
//                             />
//                         </div>
//                     </Grid>
//                 </Grid>
//             </div>
//             ) : (
//                 <NoAdmittance/>
//             )}
//         </div>
//    )
// }