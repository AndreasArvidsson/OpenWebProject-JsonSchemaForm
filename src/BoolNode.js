import React from "react";
import PropTypes from "prop-types";
import ValidationIcon from "./ValidationIcon";
import RemoveIcon from "./RemoveIcon";
import Util from "./Util";

const BoolNode = ({ value, path, schemaNode, onChange, onRemove, removable, autoFocus, error, texts = {} }) => {
    return (
        <div className="input-group">
            <label className="radio-inline">
                <input
                    type="radio"
                    checked={value === false}
                    onChange={() => onChange(path, false)}
                    autoFocus={autoFocus}
                />
                {texts.boolYes || "Yes"}
            </label>
            <label className="radio-inline">
                <input
                    type="radio"
                    checked={value === true}
                    onChange={() => onChange(path, true)}
                />
                {texts.boolNo || "No"}
            </label>
            {Util.isNullable(schemaNode) &&
                <label className="radio-inline">
                    <input
                        type="radio"
                        checked={value === null || value === undefined}
                        onChange={() => onChange(path, null)}
                    />
                    {texts.boolNull || "Null"}
                </label>
            }
            <ValidationIcon error={error} />
            {removable && <RemoveIcon path={path} onClick={onRemove} />}
        </div>
    );
};
BoolNode.propTypes = {
    value: PropTypes.bool,
    path: PropTypes.string.isRequired,
    schemaNode: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    error: PropTypes.string,
    removable: PropTypes.bool,
    onRemove: PropTypes.func.isRequired,
    autoFocus: PropTypes.bool,
    texts: PropTypes.object
};
export default BoolNode;