import React from "react";
import PropTypes from "prop-types";
import Glyph from "owp.glyphicons";

const ChevronIcon = ({ disabled, show }) => {
    return (
        <button 
            className="btn" 
            style={{ backgroundColor: "transparent" }} 
            disabled={disabled}
        >
            <Glyph type={show ? "chevron-up":"chevron-down"} />
        </button>
    );
};
ChevronIcon.propTypes = {
    disabled: PropTypes.bool.isRequired,
    show: PropTypes.bool.isRequired
};
export default React.memo(ChevronIcon);