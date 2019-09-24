import React from "react";
import PropTypes from "prop-types";
import ValidationIcon from "./ValidationIcon";
import RemoveIcon from "./RemoveIcon";
import Util from "./Util";

const EnumInput = ({ value, path, schemaNode, onChange, errors, remove, onRemove, autoFocus, getText }) => {
    if (value === null || value === undefined) {
        value = "";
    }
    return (
        <div className="input-group">
            <select
                className="form-control"
                value={value}
                onChange={e => onChange(path, e.target.value)}
                autoFocus={autoFocus}
            >
                {renderEnumOptions(value, schemaNode, getText)}
            </select>
            <ValidationIcon errors={errors} />
            {remove && <RemoveIcon path={path} onClick={onRemove} />}
        </div>
    );
}
EnumInput.propTypes = {
    value: PropTypes.string,
    path: PropTypes.string.isRequired,
    schemaNode: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    errors: PropTypes.array,
    remove: PropTypes.bool,
    onRemove: PropTypes.func.isRequired,
    autoFocus: PropTypes.bool,
    getText: PropTypes.func.isRequired
};
export default EnumInput;

const renderEnumOptions = (value, node, getText) => {
    let nullOptionAdded = false;
    let options;
    //Standard enum with just values.
    if (node.enum) {
        options = node.enum.map(e => {
            if (e === null) {
                nullOptionAdded = true;
                return <option key={e} value={e}>{getText("selectNull")}</option>
            }
            return <option key={e} value={e}>{e}</option>
        });
    }
    //More advanced enum with possible title and description.
    else if (node.oneOf) {
        options = node.oneOf.map(oneOf => {
            if (oneOf.const === null) {
                nullOptionAdded = true;
            }
            return <option key={oneOf.const} value={oneOf.const} title={oneOf.description}>
                {oneOf.title || oneOf.const}
            </option>
        });
    }
    //Have no null choice and we are already in null state or is nullable.
    if (!nullOptionAdded && (!value || Util.isNullable(node))) {
        options.unshift(<option key={null} value={null}>{getText("selectNull")}</option>);
    }
    return options;
}
renderEnumOptions.propTypes = {
    value: PropTypes.string,
    enum: PropTypes.array.isRequired,
    oneOf: PropTypes.object.isRequired
};