import React from "react";
import PropTypes from "prop-types";
import Glyph from "owp.glyphicons";

const ValidationIcon = ({ errors }) => {
    if (errors) {
        return (
            <span className="input-group-addon">
                <Glyph type="ban-circle" style={{ color: "red" }} title={errors.join("\n")} />
            </span>
        );
    }
    return (
        <span className="input-group-addon">
            <Glyph type="ok-circle" style={{ color: "green" }} title="Validation is ok" />
        </span>
    );
}
ValidationIcon.propTypes = {
    errors: PropTypes.array
};
export default React.memo(ValidationIcon);