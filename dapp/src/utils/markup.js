import pageOne from "../components/markdown/test.md";
import pageTwo from "../components/markdown/newTest.md";
import pageThree from "../components/markdown/thirdTest.md";
import devMenuData from '../resource/devMenuData.json';
import teacherMenuData from '../resource/teacherMenuData.json';
import adminMenuData from '../resource/adminMenuData.json';
import ownerMenuData from '../resource/ownerMenuData.json';

import {DOCS} from "../components/sections/DOCS";

export const devMarkup = {
    page1: pageOne,
    page2: pageTwo,
    page3: pageThree
};

export const devDocs = (props) => {
    const myProps = {
        menuData: devMenuData,
        markup: devMarkup
    };
    return <DOCS {...myProps} {...props} />;
};

export const teacherMarkup = {
    page1: pageOne,
    page2: pageTwo
};

export const teacherDocs = (props) => {
    const myProps = {
        menuData: teacherMenuData,
        markup: teacherMarkup
    };
    return <DOCS {...myProps} {...props} />;
};

export const ownerMarkup = {
    page1: pageOne,
    page2: pageTwo
};

export const ownerDocs = (props) => {
    const myProps = {
        menuData: ownerMenuData,
        markup: ownerMarkup
    };
    return <DOCS {...myProps} {...props} />;
};

export const adminMarkup = {
    page1: pageOne,
    page2: pageTwo
};

export const adminDocs = (props) => {
    const myProps = {
        menuData: adminMenuData,
        markup: adminMarkup
    };
    return <DOCS {...myProps} {...props} />;
};