import React from "react";
import { Route, Redirect } from "react-router-dom";

import { checkConnectedWalletAddress } from "./AuthCheck";

const AppRoute = ({
  component: Component,
  layout: Layout,
  isPrivate,
  ...rest
}) => {

  Layout = Layout === undefined ? (props) => <>{props.children}</> : Layout;

  const authCheck = checkConnectedWalletAddress();
  if (!isPrivate || authCheck.auth) {
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
  } else {
    <Redirect to="/login" />;
  }
};

export default AppRoute;
