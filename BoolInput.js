import React from "react";
import PropTypes from "prop-types";
import ValidationIcon from "./ValidationIcon";
import RemoveIcon from "./RemoveIcon";
import Util from "./Util";

const BoolInput = ({ value, path, schemaNode, onChange, errors, remove, onRemove, autoFocus, getText }) => {
    return (
        <div className="input-group">
            <label>
                <input
                    type="radio"
                    checked={value === false}
                    onChange={() => onChange(path, false)}
                    autoFocus={autoFocus}
                />
                {getText("boolYes")}
            </label>
            <label>
                <input
                    type="radio"
                    checked={value === true}
                    onChange={() => onChange(path, true)}
                />
                {getText("boolNo")}
            </label>
            {Util.isNullable(schemaNode) &&
                <label>
                    <input
                        type="radio"
                        checked={value === null || value === undefined}
                        onChange={() => onChange(path, null)}
                    />
                    {getText("boolNull")}
                </label>
            }
            <ValidationIcon errors={errors} />
            {remove && <RemoveIcon path={path} onClick={onRemove} />}
        </div>
    );
}
BoolInput.propTypes = {
    value: PropTypes.bool,
    path: PropTypes.string.isRequired,
    schemaNode: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    errors: PropTypes.array,
    remove: PropTypes.bool,
    onRemove: PropTypes.func.isRequired,
    autoFocus: PropTypes.bool,
    getText: PropTypes.func.isRequired
};
export default BoolInput;