import {Grid} from "@mui/material";
import {Link} from "react-router-dom";
import Header from "../layout/Header";
import Footer from "../layout/Footer";
import diploma from "./icons/diploma.png";
import terminal from "./icons/terminal.png";
import graduationCap from "./icons/graduation-cap.png";
import chalkboardUser from "./icons/chalkboard-user.png";

export function DocsInitialPage(){


    return(
        <>
            <Header authenticated />
                    <main>
                        <div className="ui container">
                            <h1 className="welcome-header">Decentraland University Documentation</h1>
                            <h3 className="welcome-secondary">The Home Of Metaverse Education</h3>
                            <Grid container>
                                <Grid item xs={3}>
                                    <Link to={"/docs/dev/installation"}>
                                        <div className="user-card" style={{background: '#FF2D55'}}>
                                            <div className="card-icon">
                                                <img height="25px" src={terminal} alt="Icon" />
                                            </div>
                                            <h3>For Developers</h3>
                                        </div>
                                    </Link>
                                </Grid>
                                <Grid item xs={3}>
                                    <Link to={"/docs/teacher/config"}>
                                        <div className="user-card" style={{background: '#4947CD'}}>
                                            <div className="card-icon">
                                                <img height="25px" src={graduationCap} alt="Icon" />
                                            </div>
                                            <h3>For Teachers</h3>
                                        </div>
                                    </Link>
                                </Grid>
                                <Grid item xs={3}>
                                    <Link to={"/docs/owner/ownerGettingStarted"}>
                                        <div className="user-card" style={{background: '#EE834A'}}>
                                            <div className="card-icon">
                                                <img height="25px" src={diploma} alt="Icon" />
                                            </div>
                                            <h3>For Land Owners</h3>
                                        </div>
                                    </Link>
                                </Grid>
                                <Grid item xs={3}>
                                    <Link to={"/docs/admin/classrooms"}>
                                        <div className="user-card" style={{background: '#638F35'}}>
                                            <div className="card-icon">
                                                <img height="25px" src={chalkboardUser} alt="Icon" />
                                            </div>
                                            <h3>For Classroom Administrators</h3>
                                        </div>
                                    </Link>
                                </Grid>
                            </Grid>
                        </div>
                    </main>
            <Footer />
        </>
    )
}