import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Dashboard from "./pages/admin/home/Dashboard";
import SignIn from "./pages/login/SignIn";
import SignUp from "./pages/signup/SignUp";
import Location from "./pages/admin/locations/Location"
import WorkerDash from "./pages/worker/home/WorkerDash";
import UpdateLoc from "./pages/admin/locations/UpdateLoc";
import Worker from "./pages/admin/workers/Worker";
import UpdateWorker from "./pages/admin/workers/UpdateWorker";
import Request from "./pages/admin/requests/Request";
import Profile from "./pages/worker/profile/Profile";
import Protected from "./components/AuthRoutes/Protected";
import SignInRoute from "./components/AuthRoutes/SignInRoute";
import Error from "./pages/error/Error";
import ForgotPassword from "./pages/login/ForgotPassword";
import PasswordReset from "./pages/login/PasswordReset";
import Unauthorized from "./pages/error/Unauthorized";

function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <SignInRoute exact path="/" component={SignIn}/>
          <Route exact path="/signup/worker" component={SignUp}/>
          <Route exact path="/password" component={ForgotPassword}/>
          <Route exact path="/password/reset/:id/:token" component={PasswordReset}/>
          <Route exact path="/unauthorized" component={Unauthorized}/>
          <Protected access="admin" exact path="/admin/" component={Dashboard}/>
          <Protected access="admin" exact path="/admin/worker" component={Worker}/>
          <Protected access="admin" exact path="/admin/worker/update/:id" component={UpdateWorker}/>
          <Protected access="admin" exact path="/admin/location" component={Location}/>
          <Protected access="admin" exact path="/admin/location/update/:id" component={UpdateLoc}/>
          <Protected access="admin" exact path="/admin/requests" component={Request}/>
          <Protected access="worker" exact path="/worker" component={WorkerDash}/>
          <Protected access="worker" exact path="/worker/profile" component={Profile}/>
          <Route path="*" component={Error}/>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
