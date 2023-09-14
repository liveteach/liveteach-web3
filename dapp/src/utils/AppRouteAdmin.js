import React  from "react";
import { Route, Redirect } from "react-router-dom";

import { checkConnectedWalletAddress } from "./AuthCheck";

const AppRouteAdmin = ({
                                 component: Component,
                                 layout: Layout,
                                 isPrivate,
                                 ...rest
                             }) => {

    const authCheck = checkConnectedWalletAddress()

    if (!isPrivate ) {
        return (
            <Route
                {...rest}
                render={(props) => (
                    <Layout>
                        <Component {...props} />
                    </Layout>
                )}
            />
        );
    } else if (!isPrivate || authCheck.auth) {
        return(
            <Redirect to="/student"/>
        )

    } else {
        return(
            <Redirect to="/login"/>
        )

    }
};

export default AppRouteAdmin;