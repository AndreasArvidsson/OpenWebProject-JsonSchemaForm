import React from "react";
import PropTypes from "prop-types";
import ValidationIcon from "./ValidationIcon";
import RemoveIcon from "./RemoveIcon";
import Util from "./Util";

const BoolNode = ({ value, path, schemaNode, updateModel, errors, removable, removePath, autoFocus, getText }) => {
    return (
        <div className="input-group">
            <label className="radio-inline">
                <input
                    type="radio"
                    checked={value === false}
                    onChange={() => updateModel(path, false)}
                    autoFocus={autoFocus}
                />
                {getText("boolYes")}
            </label>
            <label className="radio-inline">
                <input
                    type="radio"
                    checked={value === true}
                    onChange={() => updateModel(path, true)}
                />
                {getText("boolNo")}
            </label>
            {Util.isNullable(schemaNode) &&
                <label className="radio-inline">
                    <input
                        type="radio"
                        checked={value === null || value === undefined}
                        onChange={() => updateModel(path, null)}
                    />
                    {getText("boolNull")}
                </label>
            }
            <ValidationIcon errors={errors} />
            {removable && <RemoveIcon path={path} onClick={removePath} />}
        </div>
    );
};
BoolNode.propTypes = {
    value: PropTypes.bool,
    path: PropTypes.string.isRequired,
    schemaNode: PropTypes.object.isRequired,
    updateModel: PropTypes.func.isRequired,
    errors: PropTypes.arrayOf(PropTypes.string),
    removable: PropTypes.bool,
    removePath: PropTypes.func.isRequired,
    autoFocus: PropTypes.bool,
    getText: PropTypes.func.isRequired
};
export default BoolNode;