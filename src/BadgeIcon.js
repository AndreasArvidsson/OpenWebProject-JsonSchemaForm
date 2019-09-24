import React from "react";
import PropTypes from "prop-types";

const BadgeIcon = ({ value }) => {
    return (
        <span className="input-group-addon input-group-item">
            <span className="badge" >{value}</span>
        </span>
    );
};
BadgeIcon.propTypes = {
    value: PropTypes.number.isRequired
};
export default React.memo(BadgeIcon);