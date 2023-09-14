import { createSlice} from "@reduxjs/toolkit";
import dayjs from "dayjs";

export const timeAndDateStateSlice = createSlice({
    name: "timeAndDate",
    initialState: {
        date: "",
        time: ""
    },
    reducers: {
        setDate: (state, action)=> {
            state.date = action.payload
        },
        setTime: (state, action) => {
            state.time = action.payload
        }
    }
});

export const { setDate, setTime } = timeAndDateStateSlice.actions;

export default timeAndDateStateSlice.reducer;