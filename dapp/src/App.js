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
import { LandOperator} from "./components/sections/landOperator/LandOperator";
import Student from "./components/sections/student/Student";
import Teacher from "./components/sections/teacher/Teacher";
import {DOCS} from "./components/sections/DOCS";
import {Route} from "react-router-dom";
import {setAuth} from "./store/adminUser";
import {AddTeacher} from "./components/sections/classroomAdmin/AddTeacher";
import {AddClassroom} from "./components/sections/classroomAdmin/AddClassroom";
import {AddClass} from "./components/sections/teacher/AddClass";
import {WorldsOwner} from "./components/sections/worldsOwner/WorldsOwner";
import {DocsInitialPage} from "./components/sections/DocsInitialPage";
import {adminDocs, devDocs, devMarkup, ownerDocs, ownerMarkup, teacherDocs} from "./utils/markup";
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
              path="/classroomadmin/teacher"
              isPrivate={isPrivate}
              component={AddTeacher}
              layout={LayoutDefault}
          />
          <AppRouteAdmin
              exact
              path="/classroomadmin/class"
              isPrivate={isPrivate}
              component={AddClassroom}
              layout={LayoutDefault}
          />
          <AppRouteAdmin
              exact
              path="/operator"
              isPrivate={isPrivate}
              component={LandOperator}
              layout={LayoutDefault}
          />
          <AppRouteAdmin
              exact
              path="/operator/add"
              isPrivate={isPrivate}
              component={AddClass}
              layout={LayoutDefault}
          />
          <AppRouteAdmin
              exact
              path="/worlds"
              isPrivate={isPrivate}
              component={WorldsOwner}
              layout={LayoutDefault}
          />
          <Route
              exact
              path="/FAQ"
              component={FAQ}
          />
          <Route
              exact
              path="/docs"
              component={DocsInitialPage}
          />
          <Route
              exact
              path="/docs/dev/:page"
              render={devDocs}
          />
          <Route
              exact
              path="/docs/teacher/:page"
              component={teacherDocs}
          />
          <Route
              exact
              path="/docs/owner/:page"
              component={ownerDocs}
          />
          <Route
              exact
              path="/docs/admin/:page"
              component={adminDocs}
          />

      </Switch>
  );
};

export default App;

