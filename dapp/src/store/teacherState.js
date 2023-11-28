import { createSlice} from "@reduxjs/toolkit";

export const teacherStateSlice = createSlice({
    name: "teacher",
    initialState: {
        walletAddress: "",
        classConfigs: [{classReference: "", contentUrl: "", id: "", teacherId: ""}],
        classIds:[],
        teacherClassrooms: [],
        selectedClass: {
            name: "",
            id: 0,
            guid: ""
        },
        newClassReference: "",
        newClassDescription: "",
        ipfsUrl: "",
        jwtToken: ""
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
        setClassIds: (state,action)=> {
            state.classIds = action.payload
        },
        setNewClassReference: (state, action) => {
            state.newClassReference = action.payload
        },
        setNewClassDescription: (state,action) => {
            state.newClassDescription = action.payload
        },
        setIpfsUrl: (state, action) => {
            state.ipfsUrl = action.payload
        },
        setJwtToken: (state, action) => {
            state.jwtToken = action.payload
        }
    }
});

export const { setWalletAddress,
    setTeacherClassrooms,
    setSelectedClass,
    setClassIds,
    setNewClassReference,
    setNewClassDescription,
    setIpfsUrl,
    setJwtToken} = teacherStateSlice.actions;

export default teacherStateSlice.reducer;