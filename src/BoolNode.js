import React from "react";
import PropTypes from "prop-types";
import ValidationIcon from "./ValidationIcon";
import RemoveIcon from "./RemoveIcon";

const BoolNode = ({ value, path, onChange, removable, onRemove, nullable, autoFocus, error, disabled, texts = {} }) => {
    const style = { cursor: disabled ? "not-allowed" : "pointer" };
    return (
        <div className="input-group">
            <label className="radio-inline" style={style}>
                <input
                    type="radio"
                    checked={value === true}
                    onChange={() => onChange(path, true)}
                    autoFocus={autoFocus}
                    disabled={disabled}
                    style={style}
                />
                {texts.boolYes || "Yes"}
            </label>
            <label className="radio-inline" style={style}>
                <input
                    type="radio"
                    checked={value === false}
                    onChange={() => onChange(path, false)}
                    disabled={disabled}
                    style={style}
                />
                {texts.boolNo || "No"}
            </label>
            {nullable &&
                <label className="radio-inline" style={style}>
                    <input
                        type="radio"
                        checked={value === null || value === undefined}
                        onChange={() => onChange(path, null)}
                        disabled={disabled}
                        style={style}
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
    onChange: PropTypes.func.isRequired,
    error: PropTypes.string,
    removable: PropTypes.bool,
    onRemove: PropTypes.func.isRequired,
    nullable: PropTypes.bool,
    autoFocus: PropTypes.bool,
    disabled: PropTypes.bool,
    texts: PropTypes.object
};

export default React.memo(BoolNode);