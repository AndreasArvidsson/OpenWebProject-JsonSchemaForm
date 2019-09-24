import React from "react";
import PropTypes from "prop-types";
import Glyph from "owp.glyphicons";

const AddIcon = ({ onClick }) => {
    return (
        <span className="input-group-btn">
            <button className="btn" onClick={onClick}>
                <Glyph type="plus" />
            </button>
        </span>
    );
};
AddIcon.propTypes = {
    onClick: PropTypes.func.isRequired
};
export default React.memo(AddIcon);