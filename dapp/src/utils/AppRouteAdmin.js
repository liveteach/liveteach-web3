import React, {useEffect} from "react";
import { Route, Redirect } from "react-router-dom";

import { userCheck,checkConnectedWalletAddress } from "./AuthCheck";

const AppRouteAdmin = ({
                                 component: Component,
                                 layout: Layout,
                                 isPrivate,
                                 ...rest
                             }) => {
    Layout = Layout === undefined ? (props) => <>{props.children}</> : Layout;

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
            <Redirect to="/home"/>
        )

    } else {
        return(
            <Redirect to="/login"/>
        )

    }
};

export default AppRouteAdmin;