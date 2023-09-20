import {Link} from "react-router-dom";
import {useSelector} from "react-redux";


export default function PageNav({
                    authenticated,
                    ...props
                }) {
    const {isPrivate} = useSelector((state) => state.adminUser)

    return (
        <div className="Navigation">
            <div className="dcl tabs">
                <div className="ui container">
                    <div className="dcl tabs-left">
                        <Link  to={"/student"} >
                            <div className="dcl tab active tabColor">
                                Student
                            </div>
                        </Link>
                        <Link  to={"/teacher"} >
                            <div className="dcl tab active tabColor">
                                Teacher
                            </div>
                        </Link>
                        {
                            !isPrivate ? (
                            <Link to={"/classroomadmin"} >
                                <div className="dcl tab tabColor">
                                    Classroom Admin
                                </div>
                            </Link>
                        ) : (
                            ""
                            )
                        }
                        {
                            !isPrivate ? (
                                <Link to={"/operator"} >
                                    <div className="dcl tab tabColor">
                                        Land Operator
                                    </div>
                                </Link>
                            ) : (
                                ""
                            )
                        }
                        {
                            !isPrivate ? (
                                <Link to={"/worlds"} >
                                    <div className="dcl tab tabColor">
                                        Worlds Owner
                                    </div>
                                </Link>
                            ) : (
                                ""
                            )
                        }
                    </div>
                </div>
            </div>
        </div>
    );
};

