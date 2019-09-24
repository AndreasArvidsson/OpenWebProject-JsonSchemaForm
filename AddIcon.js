import React from "react";
import PropTypes from "prop-types";
import Glyph from "owp.glyphicons";

const AddIcon = ({  onClick }) => {
    return (
        <span className="input-group-addon clickable" onClick={onClick}>
            <Glyph type="plus" />
        </span>
    );
}
AddIcon.propTypes = {
    onClick: PropTypes.func.isRequired
};
export default React.memo(AddIcon);