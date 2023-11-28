import { createSlice} from "@reduxjs/toolkit";

export const classStateSlice = createSlice({
    name: "class",
    initialState: {
        teacher: "",
        name: ""
    },
    reducers: {
        setTeacher: (state, action)=> {
            state.teacher = action.payload
        },
        setName: (state, action ) => {
            state.name = action.payload
        }
    }
});

export const { setTeacher, setName } = classStateSlice.actions;

export default classStateSlice.reducer;