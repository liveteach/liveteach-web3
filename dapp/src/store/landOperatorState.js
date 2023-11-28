import { createSlice} from "@reduxjs/toolkit";

export const landOperatorStateSlice = createSlice({
    name: "landOperator",
    initialState: {
        classroomAdmins: [{landIds:["1","2","3"], walletAddress:"test"}],
        newAdminWallet: "",
        newLandIds: [],
        pending: [{name: "", status: ""}],
        imgEndpoint: ""
    },
    reducers: {
        setClassroomAdmins: (state, action) => {
            state.classroomAdmins = action.payload
        },
        setNewAdminWallet: ((state, action) => {
            state.newAdminWallet = action.payload
        }),
        setNewLandIds: (state, action) => {
            state.newLandIds = action.payload
        },
        setPending: (state, action) => {
            state.pending = action.payload
        },
        setImgEndpoint: (state, action) => {
            state.imgEndpoint = action.payload
        }
    }
});

export const { setClassroomAdmins, setNewAdminWallet, setNewLandIds, setPending, setImgEndpoint} = landOperatorStateSlice.actions;

export default landOperatorStateSlice.reducer;