import pageOne from "../components/markdown/test.md";
import classroomAdminClassrooms from "../components/markdown/classroomAdmin/classroomAdminClassrooms.md";
import classroomAdminTeachers  from "../components/markdown/classroomAdmin/classroomAdminTeachers.md";
import pageTwo from "../components/markdown/thirdTest.md";
import devMenuData from '../resource/devMenuData.json';
import teacherMenuData from '../resource/teacherMenuData.json';
import adminMenuData from '../resource/adminMenuData.json';
import ownerMenuData from '../resource/ownerMenuData.json';
import {DOCS} from "../components/sections/DOCS";

export const devMarkup = {
    page1: pageOne,
    page2: pageTwo
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
    classrooms: classroomAdminClassrooms,
    teachers: classroomAdminTeachers
};

export const adminDocs = (props) => {
    const myProps = {
        menuData: adminMenuData,
        markup: adminMarkup
    };
    return <DOCS {...myProps} {...props} />;
};