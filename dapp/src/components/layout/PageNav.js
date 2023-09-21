import {Link, useLocation} from "react-router-dom";
import {useSelector} from "react-redux";
import React, {useEffect, useState} from "react";


export default function PageNav({
                    authenticated,
                    ...props
                }) {
    const {isPrivate} = useSelector((state) => state.adminUser)

    const location = useLocation();
     const currentURL = location.pathname;

    const [activeTab, setActiveTab] = useState(null);

    useEffect(() => {
        console.log(currentURL);
        switch (currentURL) {
            case '/student':
                setActiveTab('student');
                break;
            case '/teacher':
                setActiveTab('teacher');
                break;
            case '/classroomadmin':
                setActiveTab('classroomadmin');
                break;
            case '/operator':
                setActiveTab('operator');
                break;
            case '/worlds':
                setActiveTab('worlds');
                break;
            default:
                setActiveTab(null);
        }
    }, [currentURL]);

    return (
        <div className="Navigation">
            <div className="dcl tabs">
                <div className="ui container">
                    <div className="dcl tabs-left">
                        <Link  to={"/student"} >
                            <div className="dcl tab active tabColor">
                                Student
                                {activeTab === 'student' && <div className="active-bar" id="student"></div>}
                            </div>
                        </Link>
                        <Link  to={"/teacher"} >
                            <div className="dcl tab active tabColor">
                                Teacher
                                {activeTab === 'teacher' && <div className="active-bar" id="teacher"></div>}
                            </div>
                        </Link>
                        {
                            !isPrivate ? (
                            <Link to={"/classroomadmin"} >
                                <div className="dcl tab tabColor">
                                    Classroom Admin
                                    {activeTab === 'classroomadmin' && <div className="active-bar" id="classroomadmin"></div>}
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
                                        {activeTab === 'operator' && <div className="active-bar" id="operator"></div>}
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
                                        {activeTab === 'worlds' && <div className="active-bar" id="worlds"></div>}
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

