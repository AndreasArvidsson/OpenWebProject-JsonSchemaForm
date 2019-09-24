import React from "react";
import PropTypes from "prop-types";
import ValidationIcon from "./ValidationIcon";
import RemoveIcon from "./RemoveIcon";
import Util from "./Util";

const EnumNode = ({ value, path, schemaNode, updateModel, errors, removable, removePath, autoFocus, getText }) => {
    const onChange = (path, value) => {
        updateModel(path, value === "" ? null : value);
    }
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
                <EnumOptions value={value} schemaNode={schemaNode} getText={getText} />
            </select>
            <ValidationIcon errors={errors} />
            {removable && <RemoveIcon path={path} onClick={removePath} />}
        </div>
    );
};
EnumNode.propTypes = {
    value: PropTypes.string,
    path: PropTypes.string.isRequired,
    schemaNode: PropTypes.object.isRequired,
    updateModel: PropTypes.func.isRequired,
    errors: PropTypes.arrayOf(PropTypes.string),
    removable: PropTypes.bool,
    removePath: PropTypes.func.isRequired,
    autoFocus: PropTypes.bool,
    getText: PropTypes.func.isRequired
};
export default EnumNode;

const EnumOptions = ({ value, schemaNode, getText }) => {
    const getDefaultNullOption = () => {
        return <option key={null} value={null}>{getText("selectNull")}</option>;
    };
    let nullOptionAdded = false;
    let options;

    //Standard enum with just values.
    if (schemaNode.enum) {
        options = schemaNode.enum.map(e => {
            if (e === null) {
                nullOptionAdded = true;
                return getDefaultNullOption();
            }
            return <option key={e} value={e}>{e}</option>
        });
    }
    //More advanced enum with possible title and description.
    else if (schemaNode.oneOf) {
        options = schemaNode.oneOf.map(oneOf => {
            if (oneOf.const === null) {
                nullOptionAdded = true;
                return (
                    <option key={oneOf.const} value={oneOf.const} title={oneOf.description}>
                        {oneOf.title || getText("selectNull")}
                    </option>
                );
            }
            return (
                <option key={oneOf.const} value={oneOf.const} title={oneOf.description}>
                    {oneOf.title || oneOf.const}
                </option>
            );
        });
    }

    //Have no null choice and we are already in null state or is nullable.
    if (!nullOptionAdded && (!value || Util.isNullable(schemaNode))) {
        options.unshift(getDefaultNullOption());
    }

    return options;
};
const oneOf = PropTypes.shape({
    const: PropTypes.PropTypes.string,
    title: PropTypes.string,
    description: PropTypes.string
})
const schemaNode = PropTypes.shape({
    enum: PropTypes.arrayOf(PropTypes.string),
    oneOf: PropTypes.arrayOf(oneOf)
});
EnumOptions.propTypes = {
    value: PropTypes.string.isRequired,
    getText: PropTypes.func.isRequired,
    schemaNode: schemaNode.isRequired
};