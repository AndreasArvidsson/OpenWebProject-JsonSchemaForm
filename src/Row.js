import React from "react";
import PropTypes from "prop-types";

const Row = ({ left, right }) => {
    return (
        <div className="row">
            <div className="col-xs-4">
                {left}
            </div>
            <div className="col-xs-8">
                {right}
            </div>
        </div>
    );
}
Row.propTypes = {
    left: PropTypes.node,
    right: PropTypes.node
};
export default Row;