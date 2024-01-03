import React, {useEffect, useState} from "react";
import {Link, useLocation} from "react-router-dom";
import {useSelector} from "react-redux";

export default function DocsNav(){

    const location = useLocation();
    const currentURL = location.pathname;
    const pathSegments = currentURL.split('/');
    const secondPathSegment = pathSegments[2];

    const [activeTab, setActiveTab] = useState(null);

    useEffect(() => {
        console.log(currentURL);
        switch (secondPathSegment) {
            case 'dev':
                setActiveTab('dev');
                break;
            case 'teacher':
                setActiveTab('teacher');
                break;
            case 'owner':
                setActiveTab('owner');
                break;
            case 'admin':
                setActiveTab('admin');
                break;
            default:
                setActiveTab(null);
        }
    }, [currentURL, secondPathSegment]);

    return (
        <div className="Navigation">
            <div className="dcl tabs">
                <div className="ui container">
                    <div className="dcl tabs-left">
                        <Link to="/docs/dev/installation">
                            <div className="dcl tab active tabColor">
                                Developers
                                {activeTab === 'dev' && <div className="active-bar" id="dev"/>}
                            </div>
                        </Link>

                        <Link to="/docs/teacher/config">
                            <div className="dcl tab active tabColor">
                                Teachers
                                {activeTab === 'teacher' && <div className="active-bar" id="teacher"/>}
                            </div>
                        </Link>

                        <Link to="/docs/owner/ownerGettingStarted">
                            <div className="dcl tab active tabColor">
                                Land Owners
                                {activeTab === 'owner' && <div className="active-bar" id="owner"/>}
                            </div>
                        </Link>

                        <Link to="/docs/admin/classrooms">
                            <div className="dcl tab active tabColor">
                                Classroom Administrators
                                {activeTab === 'admin' && <div className="active-bar" id="admin"/>}
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

