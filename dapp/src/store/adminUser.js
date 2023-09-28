import { createSlice} from "@reduxjs/toolkit";

export const adminUserSlice = createSlice({
    name: "adminUser",
    initialState: {
        walletAddress: "",
        name: "",
        avatar: "",
        isPrivate: false,
        auth: false,
        avatarLoaded: false,
        roles: []
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
        setIsPrivate: (state,action) => {
            state.isPrivate = action.payload
        },
        setAuth: (state, action) => {
            state.auth = action.payload
        },
        setAvatarLoaded: (state, action) => {
            state.avatarLoaded = action.payload;
        },
        setRoles: (state,action) => {
            state.roles = action.payload
        }
    }
});

export const { setWalletAddress, setName, setAvatar, setIsPrivate, setAuth, setAvatarLoaded, setRoles } = adminUserSlice.actions;

export default adminUserSlice.reducer;