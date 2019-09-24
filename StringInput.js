import React from "react";
import PropTypes from "prop-types";
import ValidationIcon from "./ValidationIcon";
import RemoveIcon from "./RemoveIcon";

const StringInput = ({ value, path, onChange, errors, remove, onRemove, autoFocus }) => {
    if (value === null || value === undefined) {
        value = "";
    }
    return (
        <div className="input-group">
            <input
                type="text"
                className="form-control"
                onChange={e => onChange(path, e.target.value)}
                value={value}
                autoFocus={autoFocus}
            />
            <ValidationIcon errors={errors} />
            {remove && <RemoveIcon path={path} onClick={onRemove} />}
        </div>
    );
}
StringInput.propTypes = {
    value: PropTypes.string,
    path: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    errors: PropTypes.array,
    remove: PropTypes.bool,
    onRemove: PropTypes.func.isRequired,
    autoFocus: PropTypes.bool
};
export default StringInput;