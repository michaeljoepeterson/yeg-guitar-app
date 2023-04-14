import React from "react";
import { Link } from "react-router-dom";
import parse from 'html-react-parser';

export const LessonDescription = ({id, notes}) => {
    return (
        <Link 
        style={{
            color: 'black',
            textDecoration: 'none'
        }}
        to={`/edit-lesson/${id}`}>
            <div className="notes">
                {parse(notes)}
            </div>
        </Link>
    );
};

export default LessonDescription;