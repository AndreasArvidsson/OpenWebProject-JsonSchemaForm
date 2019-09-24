import React from "react";
import PropTypes from "prop-types";
import Glyph from "owp.glyphicons";

const RemoveIcon = ({ path, onClick }) => {
    return (
        <span className="input-group-btn">
            <button className="btn" onClick={() => onClick(path)}>
                <Glyph type="trash" />
            </button>
        </span>
    );
};
RemoveIcon.propTypes = {
    path: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired
};
export default React.memo(RemoveIcon);