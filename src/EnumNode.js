import React from "react";
import PropTypes from "prop-types";
import ValidationIcon from "./ValidationIcon";
import RemoveIcon from "./RemoveIcon";
import Util from "./Util";

const defaultNullText = "Choose";

const EnumNode = ({ value, path, schemaNode, onChange, onRemove, error, removable, autoFocus, texts = {} }) => {
    const enumChanged = (e) => {
        onChange(path, e.target.value === "" ? null : e.target.value);
    }
    if (value === null || value === undefined) {
        value = "";
    }
    return (
        <div className="input-group">
            <select
                className="form-control"
                value={value}
                onChange={enumChanged}
                autoFocus={autoFocus}
            >
                <EnumOptions value={value} schemaNode={schemaNode} texts={texts} />
            </select>
            <ValidationIcon error={error} />
            {removable && <RemoveIcon path={path} onClick={onRemove} />}
        </div>
    );
};
EnumNode.propTypes = {
    value: PropTypes.string,
    path: PropTypes.string.isRequired,
    schemaNode: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    error: PropTypes.string,
    removable: PropTypes.bool,
    onRemove: PropTypes.func.isRequired,
    autoFocus: PropTypes.bool,
    texts: PropTypes.object.isRequired
};
export default EnumNode;

const EnumOptions = ({ value, schemaNode, texts }) => {
    const getDefaultNullOption = () => {
        return <option key={null} value={null}>{texts.selectNull || defaultNullText}</option>;
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
                        {oneOf.title || texts.selectNull || defaultNullText}
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
    texts: PropTypes.object.isRequired,
    schemaNode: schemaNode.isRequired
};