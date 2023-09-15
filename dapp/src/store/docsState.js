import { createSlice} from "@reduxjs/toolkit";

export const docsSlice = createSlice({
    name: "docs",
    initialState: {
        markdown: "",
        activePage: ""
    },
    reducers: {
        setMarkdown: (state, action)=> {
            state.markdown = action.payload
        },
        setActivePage: (state, action)=> {
            state.activePage = action.payload
        },
        setOpenSubmenu: (state, action) => {
            state.openSubMenu = action.payload
        },
        setSubMenuId: (state, action) => {
            state.setSubMenuId = action.payload
        }
    }
});

export const { setMarkdown, setActivePage } = docsSlice.actions;

export default docsSlice.reducer;