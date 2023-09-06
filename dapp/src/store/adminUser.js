import { createSlice} from "@reduxjs/toolkit";

export const adminUserSlice = createSlice({
    name: "adminUser",
    initialState: {
        walletAddress: "",
        name: "",
        avatar: "",
        isPrivate: true
    },
    reducers: {
        setWalletAddress: (state, action)=> {
            state.walletAddress = action.payload
        },
        setName: (state, action) => {
            state.name = action.payload
        },
        setAvatar: (state, action) => {
            state.avatar = action.payload
        },
        setIsPrivate: ((state,action) => {
            state.isPrivate = action.payload
        })
    }
});

export const { setWalletAddress, setName, setAvatar,setIsPrivate } = adminUserSlice.actions;

export default adminUserSlice.reducer;