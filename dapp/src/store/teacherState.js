import { createSlice} from "@reduxjs/toolkit";

export const teacherStateSlice = createSlice({
    name: "teacher",
    initialState: {
        walletAddress: "",
        classConfigs: [{classReference: "", contentUrl: "", id: "", teacherId: ""}],
        teacherClassrooms: [2],
        selectedClass: {
            classReference: "",
            contentUrl: "",
            id: 0,
            teacherId: ""
        },
        newClassReference: "",
        newClassDescription: ""
    },
    reducers: {
        setWalletAddress: (state, action)=> {
            state.walletAddress = action.payload
        },
        setTeacherClassrooms: (state,action)=> {
            state.teacherClassrooms = action.payload
        },
        setSelectedClass: (state, action) => {
            state.selectedClass = action.payload
        },
        setClassConfigs: (state,action)=> {
            state.classConfigs = action.payload
        },
        setNewClassReference: (state, action) => {
            state.newClassReference = action.payload
        },
        setNewClassDescription: (state,action) => {
            state.newClassDescription = action.payload
        }
    }
});

export const { setWalletAddress,
    setTeacherClassrooms,
    setSelectedClass,
    setClassConfigs,
    setNewClassReference,
    setNewClassDescription} = teacherStateSlice.actions;

export default teacherStateSlice.reducer;