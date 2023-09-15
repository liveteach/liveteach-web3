import { configureStore,  } from "@reduxjs/toolkit";
import adminUserReducer from './adminUser';
import timeAndDateStateReducer from './timeAndDateState';
import docsStateReducer from './docsState';

// can use multiple stores for separate items
export default configureStore({
    reducer: {
        adminUser: adminUserReducer,
        timeAndDate: timeAndDateStateReducer,
        docs: docsStateReducer
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
