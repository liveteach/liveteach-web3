import { createSlice} from "@reduxjs/toolkit";

export const teacherStateSlice = createSlice({
    name: "teacher",
    initialState: {
        walletAddress: ""
    },
    reducers: {
        setWalletAddress: (state, action)=> {
            state.walletAddress = action.payload
        }
    }
});

export const { setWalletAddress } = teacherStateSlice.actions;

export default teacherStateSlice.reducer;