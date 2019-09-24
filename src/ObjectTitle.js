import React from "react";
import PropTypes from "prop-types";
import ChevronIcon from "./ChevronIcon";
import Title from "./Title";

const ObjectTitle = ({ disabled, show, setShow, schemaNode, fieldName }) => {
    if (disabled) {
        return (
            <span className="panel-title">
                <ChevronIcon disabled={disabled} show={show} />
                <Title schemaNode={schemaNode} fieldName={fieldName} />
            </span>
        );
    }
    return (
        <span className="panel-title" onClick={() => setShow(!show)} style={{ cursor: "pointer" }}>
            <ChevronIcon disabled={disabled} show={show} />
            <Title schemaNode={schemaNode} fieldName={fieldName} />
        </span>
    );
};
ObjectTitle.propTypes = {
    disabled: PropTypes.bool.isRequired,
    show: PropTypes.bool.isRequired,
    setShow: PropTypes.func.isRequired,
    fieldName: PropTypes.string.isRequired,
    schemaNode: PropTypes.shape({
        title: PropTypes.string,
        description: PropTypes.string
    }).isRequired
};
export default React.memo(ObjectTitle);