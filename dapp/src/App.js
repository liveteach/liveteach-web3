import React, {useEffect} from "react";
import { useLocation, Switch, useHistory} from "react-router-dom";
import AppRoute from "./utils/AppRoute";
import {FAQ} from "./components/sections/FAQ";

// Layouts
import LayoutDefault from "./layouts/LayoutDefault";
import LayoutLogIn from "./layouts/LayoutLogIn";

// Views
import LogIn from "./views/LogIn";

// AuthCheck Utils
import {checkConnectedWalletAddress} from "./utils/AuthCheck";
import {useDispatch, useSelector} from "react-redux";
import Home from "./views/Home";
import AppRouteAdmin from "./utils/AppRouteAdmin";
import ClassroomAdmin from "./components/sections/classroomAdmin/ClassroomAdmin";
import LandOperator from "./components/sections/LandOperator";
import Student from "./components/sections/student/Student";
import Teacher from "./components/sections/teacher/Teacher";
import {Test} from "./components/sections/Test";
import {DOCS} from "./components/sections/DOCS";
import {Route} from "react-router-dom";
import {setAuth} from "./store/adminUser";
import {AddClassroom} from "./components/sections/classroomAdmin/AddClassroom";
import {AddTeacher} from "./components/sections/classroomAdmin/AddTeacher";

const App = () => {

  const history = useHistory();
  const location = useLocation();
  const currentURL = location.pathname;

  const {isPrivate,auth} = useSelector((state) => state.adminUser)
  const dispatch = useDispatch();
  useEffect(() => {
    document.body.classList.add("is-loaded");
      dispatch(setAuth(checkConnectedWalletAddress().auth));
  }, [location]);

  useEffect(() => {

        if (auth) {
          history.push("/student");
        } else {
            if(currentURL.includes('/docs/')){
                history.push(currentURL)
            } else {
                history.push("/login");
            }
        }
  }, [auth]);

  useEffect(async () => {
      // await userCheck().then(result => {
      //       dispatch(setIsPrivate(!result.admin));
      // })
  })
  return (
      <Switch>
        {/* route to home */}
          <AppRoute
              exact
              path="/home"
              component={Home}
              layout={LayoutDefault}
          />
        {/* route for login */}
        <AppRoute
            exact
            path="/login"
            component={LogIn}
            layout={LayoutLogIn}
        />

        {/*common routes*/}

        <AppRoute
            exact
            path="/student"
            component={Student}
            layout={LayoutDefault}
        />

        <AppRoute
            exact
            path="/teacher"
            component={Teacher}
            layout={LayoutDefault}
        />

        {/* private Routes */}

          <AppRouteAdmin
              exact
              path="/classroomadmin"
              isPrivate={isPrivate}
              component={ClassroomAdmin}
              layout={LayoutDefault}
          />
          <AppRouteAdmin
              exact
              path="/operator"
              isPrivate={isPrivate}
              component={LandOperator}
              layout={LayoutDefault}
          />


          <Route
              exact
              path="/FAQ"
              component={FAQ}
          />
          <Route
              exact
              path="/docs/:page"
              component={DOCS}
          />

      </Switch>
  );
};

export default App;

