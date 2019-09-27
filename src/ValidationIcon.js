import React from "react";
import PropTypes from "prop-types";
import Glyph from "owp.glyphicons";

const ValidationIcon = ({ error }) => {
    if (error) {
        return (
            <span className="input-group-addon">
                <Glyph type="ban-circle" style={{ color: "red" }} title={error} />
            </span>
        );
    }
    return (
        <span className="input-group-addon">
            <Glyph type="ok-circle" style={{ color: "green" }} title="Validation is ok" />
        </span>
    );
};
ValidationIcon.propTypes = {
    error: PropTypes.string
};
export default React.memo(ValidationIcon);