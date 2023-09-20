import { configureStore,  } from "@reduxjs/toolkit";
import adminUserReducer from './adminUser';
import timeAndDateStateReducer from './timeAndDateState';
import docsStateReducer from './docsState';
import classroomAdminStateReducer from './classroomAdminState';
import teacherStateReducer from './teacherState';
import studentStateReducer from './studentState';
import classStateReducer from './classState';

// can use multiple stores for separate items
export default configureStore({
    reducer: {
        adminUser: adminUserReducer,
        timeAndDate: timeAndDateStateReducer,
        docs: docsStateReducer,
        classroomAdmin: classroomAdminStateReducer,
        class: classStateReducer,
        teacher: teacherStateReducer,
        student: studentStateReducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                // Use custom serialization and deserialization functions
                serialize: (action) =>
                    action.type === "timeAndDate/setDate" ? action : undefined,
                deserialize: (action) =>
                    action.type === "timeAndDate/setDate" ? action : undefined,
            },
        }),
});
