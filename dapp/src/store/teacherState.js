import { createSlice} from "@reduxjs/toolkit";

export const teacherStateSlice = createSlice({
    name: "teacher",
    initialState: {
        walletAddress: "",
        classNames: ["test1", "test2", "test3"],
        descriptions: ["a test lesson", "a lesson in tests", "testing test lessons"],
        classrooms: ["2", "4","666"]
    },
    reducers: {
        setWalletAddress: (state, action)=> {
            state.walletAddress = action.payload
        }
    }
});

export const { setWalletAddress } = teacherStateSlice.actions;

export default teacherStateSlice.reducer;