import React, {useEffect, useRef, useState} from "react";
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
                        {/*<Link  to={"/contributors"} >*/}
                        {/*    <div className="dcl tab active tabColor">*/}
                        {/*        Contributors*/}
                        {/*    </div>*/}
                        {/*</Link>*/}
                        {/*{*/}
                        {/*    !isPrivate ? (*/}
                        {/*    <Link to={"/contributoradmin"} >*/}
                        {/*        <div className="dcl tab tabColor">*/}
                        {/*            Contributor Admin*/}
                        {/*        </div>*/}
                        {/*    </Link>*/}
                        {/*) : (*/}
                        {/*    ""*/}
                        {/*    )*/}
                        {/*}*/}

                    </div>
                </div>
            </div>
        </div>
    );
};

