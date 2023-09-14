import { createSlice} from "@reduxjs/toolkit";

export const studentStateSlice = createSlice({
    name: "student",
    initialState: {
        walletAddress: ""
    },
    reducers: {
        setWalletAddress: (state, action)=> {
            state.walletAddress = action.payload
        }
    }
});

export const { setWalletAddress } = studentStateSlice.actions;

export default studentStateSlice.reducer;