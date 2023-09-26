import { createSlice} from "@reduxjs/toolkit";

export const teacherStateSlice = createSlice({
    name: "teacher",
    initialState: {
        walletAddress: "",
        classNames: ["test1", "test2", "test3"],
        descriptions: ["a test lesson", "a lesson in tests", "testing test lessons"],
        teacherClassroom: 2,
        selectedClass: {
            name: "testClass",
            description: "a small description of a test class",
            location: ["1,2","1,3","1,4"],
            enrollments: ["Gary", "Barry", "Larry"]
        }
    },
    reducers: {
        setWalletAddress: (state, action)=> {
            state.walletAddress = action.payload
        },
        setTeacherClassroom: (state,action)=> {
            state.teacherClassroom = action.payload
        },
        setSelectedClass: (state, action) => {
            state.selectedClass = action.payload
        }
    }
});

export const { setWalletAddress,setTeacherClassroom,setSelectedClass } = teacherStateSlice.actions;

export default teacherStateSlice.reducer;