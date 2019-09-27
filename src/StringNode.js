import React from "react";
import PropTypes from "prop-types";
import ValidationIcon from "./ValidationIcon";
import RemoveIcon from "./RemoveIcon";

const StringNode = ({ value, path, onChange, onRemove, error, removable, autoFocus, disabled }) => {
    const stringChanged = (e) => {
        onChange(path, e.target.value === "" ? null : e.target.value);
    } 
    if (value === null || value === undefined) {
        value = "";
    }
    return (
        <div className="input-group">
            <input
                type="text"
                className="form-control"
                onChange={stringChanged}
                value={value}
                autoFocus={autoFocus}
                disabled={disabled}
            />
            <ValidationIcon error={error} />
            {removable && <RemoveIcon path={path} onClick={onRemove} />}
        </div>
    );
};
StringNode.propTypes = {
    value: PropTypes.string,
    path: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    onRemove: PropTypes.func.isRequired,
    error: PropTypes.string,
    removable: PropTypes.bool,
    autoFocus: PropTypes.bool,
    disabled: PropTypes.bool
};
export default StringNode;