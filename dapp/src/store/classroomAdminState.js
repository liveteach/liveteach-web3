import { createSlice} from "@reduxjs/toolkit";

export const classroomAdminStateSlice = createSlice({
    name: "class",
    initialState: {
        classrooms: [],
        teachers: [],
        landParcels: ["100,91","100,92","100,93","100,94","100,95","100,96"],
        imgEndpoint: ""
    },
    reducers: {
        setClassrooms: (state, action) => {
            state.classrooms = action.payload
        },
        setTeachers: (state, action)=> {
            state.teachers = action.payload
        },
        setLandParcels: ( state, action ) => {
            state.landParcels = action.payload
        },
        setImgEndpoint: ( state, action) => {
            state.imgEndpoint = action.payload
        }
    }
});

export const { setClassrooms,setTeachers, setLandParcels, setImgEndpoint } = classroomAdminStateSlice.actions;

export default classroomAdminStateSlice.reducer;