import React from "react";
import PropTypes from "prop-types";
import ValidationIcon from "./ValidationIcon";
import RemoveIcon from "./RemoveIcon";

const IntegerNode = ({ value, path, updateModel, errors, removable, removePath, autoFocus }) => {
    const onChange = (path, value) => {
        updateModel(path, value === "" ? null : Number.parseInt(value));
    }
    if (value === null || value === undefined) {
        value = "";
    }
    return (
        <div className="input-group">
            <input
                type="number"
                className="form-control"
                onChange={e => onChange(path, e.target.value)}
                value={value}
                autoFocus={autoFocus}
            />
            <ValidationIcon errors={errors} />
            {removable && <RemoveIcon path={path} onClick={removePath} />}
        </div>
    );
};
IntegerNode.propTypes = {
    value: PropTypes.number,
    path: PropTypes.string.isRequired,
    updateModel: PropTypes.func.isRequired,
    errors: PropTypes.arrayOf(PropTypes.string),
    removable: PropTypes.bool,
    removePath: PropTypes.func.isRequired,
    autoFocus: PropTypes.bool
};
export default IntegerNode;