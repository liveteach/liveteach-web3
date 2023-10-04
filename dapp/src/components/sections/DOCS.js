import {Grid} from "@mui/material";
import {MarkdownPage} from "./partials/MarkdownPage";
import React, {useEffect} from "react";
import {useParams} from "react-router-dom/cjs/react-router-dom";
import {Link, useLocation} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import { setMarkdown, setActivePage } from "../../store/docsState";
import Header from "../layout/Header";
import Footer from "../layout/Footer";
import DocsNav from "../layout/DocsNav";

export function DOCS(props){

    let params = useParams();
    const { markdown, activePage } = useSelector((state) => state.docs)
    const dispatch = useDispatch();

    useEffect(() => {
        handlePageSwitch(params.page)
        async function fetchData() {
            try {
                const response = await fetch(props.markup[activePage]);
                const text = await response.text();
                dispatch(setMarkdown(text));
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }

        fetchData();
    }, [activePage])

    useEffect(() => {
        dispatch(setActivePage(params.page))
    })

    const handlePageSwitch = (e, page) => {
        setActivePage(page);
    };

    const handleDropdown = (id) => {
        let currentClass = document.getElementById(id).className
        if(currentClass === "dropDownHidden"){
            document.getElementById(id).className = "dropDownShow"
        } else {
            document.getElementById(id).className = "dropDownHidden"
        }
    }

    return(
        <>
        <Header />
            <DocsNav />
                <main>
                    <div className="ui container">
                        <Grid container>
                            <Grid item xs={3}>
                                <aside className="book-menu sidebar" >
                                    <div className="book-menu-content ">
                                        <ul>
                                            {
                                                props.menuData.map(item => (
                                                    <div key={"heading" + item.heading} className="menuSpacing">
                                                        <h3 style={{textAlign: 'left'}}>{item.heading}</h3>
                                                        {
                                                            item.menuItems.map(link => (
                                                                <li key={link.id}>
                                                                    <Link style={{color: 'white'}} to={link.link ? link.link : ""}
                                                                          key={link.label} onClick={(e) => {
                                                                        if (link.subMenu) {
                                                                            e.preventDefault();
                                                                            handlePageSwitch(e, link.label);
                                                                            handleDropdown("subMenu"+link.id);
                                                                        }
                                                                        }}>{link.label}</Link>
                                                                        {link.subMenu && (
                                                                            <ul key={link.subMenu + link.id} className={"dropDownHidden"} id={"subMenu"+link.id}>
                                                                                {link.subMenu.map(subItem => (
                                                                                    <li key={subItem.id}>
                                                                                        <Link style={{color: 'white'}}
                                                                                              to={subItem.link}
                                                                                              onClick={(e) => handlePageSwitch(e, link.label)}>{subItem.label}</Link>
                                                                                    </li>
                                                                                ))}
                                                                            </ul>
                                                                    )}
                                                            </li>
                                                            ))}
                                                    </div>
                                                ))}
                                        </ul>
                                    </div>
                                </aside>
                            </Grid>
                            <Grid item xs={9}>
                                <MarkdownPage content={markdown}/>
                            </Grid>
                        </Grid>
                    </div>
                </main>
            <Footer />
        </>
    )
}