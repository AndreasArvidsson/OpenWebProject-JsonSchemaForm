import React from "react";
import PropTypes from "prop-types";
import ValidationIcon from "./ValidationIcon";
import RemoveIcon from "./RemoveIcon";

const EnumNode = ({ value, path, schemaNode, onChange, error, removable, onRemove, nullable, autoFocus, disabled, texts = {} }) => {
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
                disabled={disabled}
            >
                <EnumOptions value={value} schemaNode={schemaNode} texts={texts} nullable={nullable} />
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
    nullable: PropTypes.bool,
    autoFocus: PropTypes.bool,
    disabled: PropTypes.bool,
    texts: PropTypes.object
};

export default React.memo(EnumNode);

const defaultNullText = "Choose";

const EnumOptions = ({ value, schemaNode, texts, nullable }) => {
    const getDefaultNullOption = () => {
        return (
            <option key="" value="">
                {texts.selectNull || defaultNullText}
            </option>
        );
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
                    <option key="" value="" title={oneOf.description}>
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
    if (!nullOptionAdded && (!value || nullable)) {
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
    schemaNode: schemaNode.isRequired,
    nullable: PropTypes.bool
};