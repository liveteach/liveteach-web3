import { createSlice} from "@reduxjs/toolkit";

export const classroomAdminStateSlice = createSlice({
    name: "classroomAdmin",
    initialState: {
        classrooms: ["test", "test2", "test3"],
        classroomIds: ["1","2","3"],
        teachers: ["Yoda", "Batman", "Mr Kimble"],
        teachersWallets: ["0xed6767397324g", "0x8737980h234579df", "0x987432iu45iu239"],
        landParcels: ["100,91","100,92","100,93","100,94","100,95","100,96"],
        imgEndpoint: ""
    },
    reducers: {
        setClassrooms: (state, action) => {
            state.classrooms = action.payload
        },
        setClassRoomIds: (state, action) => {
            state.classroomIds = action.payload
        },
        setTeachers: (state, action)=> {
            state.teachers = action.payload
        },
        setTeachersWallets: (state, action) => {
            state.teachersWallets = action.payload
        },
        setLandParcels: ( state, action ) => {
            state.landParcels = action.payload
        },
        setImgEndpoint: ( state, action) => {
            state.imgEndpoint = action.payload
        }
    }
});

export const { setClassrooms, setClassRoomIds,setTeachers, setTeachersWallets, setLandParcels, setImgEndpoint } = classroomAdminStateSlice.actions;

export default classroomAdminStateSlice.reducer;