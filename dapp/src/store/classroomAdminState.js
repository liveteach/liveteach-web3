import { createSlice} from "@reduxjs/toolkit";

export const classroomAdminStateSlice = createSlice({
    name: "classroomAdmin",
    initialState: {
        classrooms: [{name: "test", id: 2, landIds: ["1","2"]},{name: "test2", id: 3, landIds: ["3","4"]}],
        className: "",
        classLandIds: [],
        teachers: [{id: 0, walletAddress:"0x12345", classRoomIds:[1,2,3,4],classroomAdminId:"0x12345"}],
        imgEndpoint: "",
        guid: "",
        pendingClassrooms: [{name: "", status: ""}],
        pendingTeachers: [{name: "", status: ""}]
    },
    reducers: {
        setClassrooms: (state, action) => {
            state.classrooms = action.payload
        },
        setClassName: (state, action) => {
            state.className = action.payload
        },
        setClassLandIds:(state, action) => {
            state.classLandIds = action.payload
        },
        setTeachers: (state, action)=> {
            state.teachers = action.payload
        },
        setImgEndpoint: ( state, action) => {
            state.imgEndpoint = action.payload
        },
        setGuid: (state, action) => {
            state.guid = action.payload
        },
        setPendingClassrooms: (state, action) => {
            state.pendingClassrooms = action.payload
        },
        setPendingTeachers: (state, action) => {
            state.pendingTeachers = action.payload
        }
    }
});

export const { setClassrooms, setClassName, setClassLandIds, setTeachers, setImgEndpoint, setGuid, setPendingTeachers, setPendingClassrooms } = classroomAdminStateSlice.actions;

export default classroomAdminStateSlice.reducer;