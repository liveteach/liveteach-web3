import Header from "../layout/Header";
import Footer from "../layout/Footer";
import Typography from '@mui/material/Typography';
import FaqJSON from './FaqJSON.json'
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import {AccordionDetails} from "@material-ui/core";
import {useState} from "react";

export function FAQ(props){

    const [expanded, setExpanded] = useState('');

    const handleChange = (panel) => (event, newExpanded) => {
        setExpanded(newExpanded ? panel : false);
    };

    return(
        <>
            <Header authenticated />
            <div className="dcl tabs" />
                <main>
                    <div className="ui container">
                        {
                            FaqJSON.map((item, index) => {
                               return <Accordion expanded={expanded === `panel${index}`} onChange={handleChange(`panel${index}`)} className="faqAccordion">
                                    <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
                                        <Typography>{item.text}</Typography>
                                    </AccordionSummary>
                                    <AccordionDetails className="faqAccordionDetails">
                                        <Typography>
                                            <p dangerouslySetInnerHTML={{__html: item.answer}}/>
                                        </Typography>
                                    </AccordionDetails>
                                </Accordion>
                            })
                        }
                    </div>
                </main>
            <Footer />
        </>
    )
}