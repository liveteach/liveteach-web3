import devInstallation from "../components/markdown/developer/installation.md";
import classroomAdminClassrooms from "../components/markdown/classroomAdmin/classroomAdminClassrooms.md";
import classroomAdminTeachers  from "../components/markdown/classroomAdmin/classroomAdminTeachers.md";
import * as teacher from  "../components/markdown/teacher/index";
import devGettingStarted from "../components/markdown/developer/gettingStarted.md";
import ownerGettingStarted from "../components/markdown/owner/gettingStarted.md";
import devMenuData from '../resource/devMenuData.json';
import teacherMenuData from '../resource/teacherMenuData.json';
import adminMenuData from '../resource/adminMenuData.json';
import ownerMenuData from '../resource/ownerMenuData.json';
import {DOCS} from "../components/sections/DOCS";

export const devMarkup = {
    page1: devInstallation,
    page2: devGettingStarted
};

export const devDocs = (props) => {
    const myProps = {
        menuData: devMenuData,
        markup: devMarkup
    };
    return <DOCS {...myProps} {...props} />;
};

export const teacherMarkup = {
    config: teacher.teacherConfigCreation,
    imagesAndVideos: teacher.imagesAndVideo,
    models: teacher.models,
    polls: teacher.polls,
    special: teacher.special,
    publish: teacher.publish
};

export const teacherDocs = (props) => {
    const myProps = {
        menuData: teacherMenuData,
        markup: teacherMarkup
    };
    return <DOCS {...myProps} {...props} />;
};

export const ownerMarkup = {
    page1: ownerGettingStarted
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