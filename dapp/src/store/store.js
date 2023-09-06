import { configureStore,  } from "@reduxjs/toolkit";
import adminUserReducer from './adminUser';

// can use multiple stores for separate items
export default configureStore({
    reducer: {
        adminUser: adminUserReducer
    },
});
