import React from "react";
import PropTypes from "prop-types";
import ValidationIcon from "./ValidationIcon";
import RemoveIcon from "./RemoveIcon";

const NumberNode = ({ value, path, onChange, onRemove, error, removable, autoFocus, disabled }) => {
    const numberChanged = (e) => {
        onChange(path, e.target.value === "" ? null : Number.parseFloat(e.target.value));
    }
    if (value === null || value === undefined) {
        value = "";
    }
    return (
        <div className="input-group">
            <input
                type="number"
                className="form-control"
                onChange={numberChanged}
                value={value}
                autoFocus={autoFocus}
                disabled={disabled}
            />
            <ValidationIcon error={error} />
            {removable && <RemoveIcon path={path} onClick={onRemove} />}
        </div>
    );
};
NumberNode.propTypes = {
    value: PropTypes.number,
    path: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    onRemove: PropTypes.func.isRequired,
    error: PropTypes.string,
    removable: PropTypes.bool,
    autoFocus: PropTypes.bool,
    disabled: PropTypes.bool
};
export default NumberNode;