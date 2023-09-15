import pageOne from '../markdown/test.md'
import pageTwo from '../markdown/newTest.md'
import {Grid} from "@mui/material";
import {MarkdownPage} from "./partials/MarkdownPage";
import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom/cjs/react-router-dom";
import {Link} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import { setMarkdown, setActivePage } from "../../store/docsState";
import Header from "../layout/Header";
import Footer from "../layout/Footer";

export function DOCS(props){

    let params = useParams();

    const { markdown, activePage } = useSelector((state) => state.docs)
    const dispatch = useDispatch();

    useEffect(() => {
        fetch(markdownContent[activePage]).then(r => r.text()).then(text => {
            dispatch(setMarkdown(text))
        })
    }, [activePage])

    useEffect(() => {
        dispatch(setActivePage(params.page))
    })

    const markdownContent = {
        page1: pageOne,
        page2: pageTwo,
    };

    const handlePageSwitch = (e, page) => {
        console.log(page)
        setActivePage(page);
    };

    return(
        <>
        <Header authenticated />
            <div className="dcl tabs" />
                <main>
                    <div className="ui container">
                        <Grid container>
                            <Grid item xs={2}>
                                <aside className="book-menu sidebar">
                                    <div className="book-menu-content">
                                        <ul>
                                        {Object.keys(markdownContent).map((page) => (
                                            <li key={"li" + page}>
                                                <Link to={`/docs/${page}`} style={{color: 'white'}} key={page} onClick={(e) => handlePageSwitch(e,page)}>
                                                    {page}
                                                </Link>
                                            </li>
                                        ))}
                                        </ul>
                                    </div>
                                </aside>
                            </Grid>
                            <Grid item xs={10}>
                                <MarkdownPage content={markdown}/>
                            </Grid>
                        </Grid>
                    </div>
                </main>
            <Footer />
        </>
    )
}