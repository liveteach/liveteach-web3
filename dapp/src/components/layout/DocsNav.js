import React, {useEffect, useRef, useState} from "react";
import {Link, useLocation} from "react-router-dom";


export default function DocsNav(){

    const location = useLocation();
    const currentURL = location.pathname;

    // Use state to keep track of the active tab
    const [activeTab, setActiveTab] = useState(null);

    useEffect(() => {
        console.log(currentURL);
        switch (currentURL) {
            case '/docs/dev/page1':
                setActiveTab('dev');
                break;
            case '/docs/teacher/page1':
                setActiveTab('teacher');
                break;
            case '/docs/owner/page1':
                setActiveTab('owner');
                break;
            case '/docs/admin/page1':
                setActiveTab('admin');
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
                        <Link to="/docs/dev/page1">
                            <div className="dcl tab active tabColor">
                                Developers
                                {activeTab === 'dev' && <div className="active-bar" id="dev"></div>}
                            </div>
                        </Link>

                        <Link to="/docs/teacher/page1">
                            <div className="dcl tab active tabColor">
                                Teachers
                                {activeTab === 'teacher' && <div className="active-bar" id="teacher"></div>}
                            </div>
                        </Link>

                        <Link to="/docs/owner/page1">
                            <div className="dcl tab active tabColor">
                                Land Owners
                                {activeTab === 'owner' && <div className="active-bar" id="owner"></div>}
                            </div>
                        </Link>

                        <Link to="/docs/admin/page1">
                            <div className="dcl tab active tabColor">
                                Classroom Administrators
                                {activeTab === 'admin' && <div className="active-bar" id="admin"></div>}
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

