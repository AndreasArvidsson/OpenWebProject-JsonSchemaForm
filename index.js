/**
 * @author Andreas Arvidsson
 * https://github.com/AndreasArvidsson/OpenWebProject-JsonSchemaForm
 */
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import _get from "lodash.get";
import _set from "lodash.set";
import _unset from "lodash.unset";
import uuid from "uuid/v4";
import jsonSchema from "jsonschema";
import Glyph from "owp.glyphicons";
import "./styles.css";
import "./Object";
import "./String";

const defaultTexts = {
    boolYes: "Yes",
    boolNo: "No",
    boolNull: "Null",
    selectNull: "Choose"
};

const JsonSchemaForm = ({ schema, model, onChange, texts = {} }) => {
    const [errors, setErrors] = useState();

    useEffect(() => {
        const newErrors = getErrors(model);
        if (onChange) {
            onChange(model, newErrors);
        }
        setErrors(newErrors);
    }, [model]);

    const updateRef = (schemaNode) => {
        if (schemaNode["$ref"]) {
            const path = schemaNode["$ref"].substring(2).replaceAll("/", ".");
            return _get(schema, path);
        }
        return schemaNode;
    }

    const getText = (field) => {
        return texts[field] || defaultTexts[field] || "Missing text";
    }

    const getNew = (schemaNode) => {
        schemaNode = updateRef(schemaNode);
        const type = getType(schemaNode);
        switch (type) {
            case "object":
                return {};
            case "array":
                return [];
            default:
                return null;
        }
    }

    function getErrors (newCopy) {
        const errors = jsonSchema.validate(newCopy, schema).errors;
        const res = {};
        errors.forEach(error => {
            const path = getErrorPath(error);
            if (!res[path]) {
                res[path] = [];
            }
            res[path].push(error.message.capitalizeFirst());
        });
        return res;
    }

    const updateCopy = (path, value) => {
        const newCopy = { ...model };
        _set(newCopy, path, value);
        const newErrors = getErrors(newCopy);
        // setCopy(newCopy);
        setErrors(newErrors);
        if (onChange) {
            onChange(newCopy, newErrors, path, value);
        }
    }

    const onRemove = (path) => {
        const newCopy = { ...model };
        //Array item.
        if (path.endsWith("]")) {
            const i = path.lastIndexOf("[");
            const parentPath = path.substring(0, i);
            const index = parseInt(path.substring(i + 1, path.length - 1));
            _get(newCopy, parentPath).splice(index, 1);
        }
        //Object
        else {
            _unset(newCopy, path);
        }
        const newErrors = getErrors(newCopy);
        if (onChange) {
            onChange(newCopy, newErrors, path);
        }
        // setCopy(newCopy);
        setErrors(newErrors);
    }

    const onChangeString = (path, value) => {
        if (value === "") {
            updateCopy(path, null);
        }
        else {
            updateCopy(path, value);
        }
    }

    const onChangeNumber = (path, value) => {
        if (value === "") {
            updateCopy(path, null);
        }
        else {
            updateCopy(path, Number.parseFloat(value));
        }
    }

    const onChangeInteger = (path, value) => {
        if (value === "") {
            updateCopy(path, null);
        }
        else {
            updateCopy(path, Number.parseInt(value));
        }
    }

    const getValidationIcon = (path) => {
        const nodeErrors = errors[path];
        if (nodeErrors) {
            return (
                <span className="input-group-addon">
                    <Glyph type="ban-circle" style={{ color: "red" }} title={nodeErrors.join("\n")} />
                </span>
            );
        }
        return (
            <span className="input-group-addon">
                <Glyph type="ok-circle" style={{ color: "green" }} title="Validation is ok" />
            </span>
        );
    }

    const getRemoveIcon = (remove, path) => {
        if (remove) {
            return (
                <span className="input-group-addon clickable" onClick={() => onRemove(path)}>
                    <Glyph type="trash" />
                </span>
            );
        }
    }

    const getAddIcon = (onClick) => {
        return (
            <span className="input-group-addon clickable" onClick={onClick}>
                <Glyph type="plus" />
            </span>
        );
    }

    const renderObject = ({ value, path, schemaNode, remove, fieldName }) => {

        const addNew = () => {
            updateCopy(path, getNew(schemaNode));
        }

        const getContent = (autoFocus) => {
            if (!value) {
                return null;
            }
            return (
                <React.Fragment>
                    {schemaNode.properties &&
                        schemaNode.properties.map((schemaNode, fieldName) => {
                            return renderObjectField({
                                value: value[fieldName],
                                path: updatePath(path, fieldName),
                                autoFocus: autoFocus-- > 0,
                                schemaNode, fieldName
                            });
                        })
                    }
                </React.Fragment>
            );
        }

        //Root node. Dont add panel.
        if (!path) {
            return (
                <div>
                    {getContent(1)}
                </div>
            );
        }

        if (!remove) {
            remove = value && isNullable(schemaNode);
        }
        const title = getTitle(schemaNode, fieldName);
        const className = value ? "default" : "warning";
        return (
            <div className={"panel panel-" + className}>
                <div className="panel-heading">
                    <span className="input-group">
                        <span className="panel-title">
                            {title}
                        </span>
                        {getValidationIcon(path)}
                        {(!value && !remove) && getAddIcon(addNew)}
                        {getRemoveIcon(remove, path)}
                    </span>
                </div>
                {value &&
                    <div className="panel-body">
                        {getContent(0)}
                    </div>
                }
            </div>
        );
    }
    renderObject.propTypes = {
        value: PropTypes.object,
        path: PropTypes.string.isRequired,
        schemaNode: PropTypes.object.isRequired,
        remove: PropTypes.bool,
        fieldName: PropTypes.string.isRequired
    };

    const renderObjectField = (props) => {
        const node = renderNode(props);
        return (
            <React.Fragment key={props.fieldName}>
                {
                    addRow(props.schemaNode)
                        ? <Row
                            left={
                                getTitle(props.schemaNode, props.fieldName)
                            }
                            right={
                                node
                            }
                        />
                        : node
                }
            </React.Fragment>
        );
    }
    renderObjectField.propTypes = {
        schemaNode: PropTypes.object.isRequired,
        fieldName: PropTypes.string.isRequired
    };

    const renderArray = ({ value, path, schemaNode, remove, fieldName }) => {
        const addNew = () => {
            updateCopy(path, getNew(schemaNode));
        }
        const addNewChild = () => {
            updateCopy(path + "[" + value.length + "]", getNew(schemaNode.items));
        }
        if (!remove) {
            remove = value && isNullable(schemaNode);
        }
        const key = uuid();
        const className = value ? "default" : "warning";
        return (
            <div className={"panel panel-" + className}>
                <div className="panel-heading">
                    <span className="input-group">
                        <span className="panel-title">
                            {getTitle(schemaNode, fieldName)}
                        </span>
                        {value &&
                            <React.Fragment>
                                {getAddIcon(addNewChild)}
                                <span className="input-group-addon" style={{ padding: 3, paddingRight: 7 }}>
                                    <span className="badge" >{value.length}</span>
                                </span>
                            </React.Fragment>
                        }
                        {getValidationIcon(path)}
                        {(!value && !remove) && getAddIcon(addNew)}
                        {getRemoveIcon(remove, path)}
                    </span>
                </div>
                {value &&
                    <div className="panel-body">
                        {value && value.map((v, i) =>
                            <React.Fragment key={key + i}>
                                {renderNode({
                                    value: v,
                                    path: updatePath(path, i),
                                    schemaNode: schemaNode.items,
                                    fieldName: i,
                                    remove: true
                                })}
                            </React.Fragment>
                        )}
                    </div>
                }
            </div>
        );
    }
    renderArray.propTypes = {
        value: PropTypes.array,
        path: PropTypes.string.isRequired,
        remove: PropTypes.bool,
        schemaNode: PropTypes.object.isRequired,
        fieldName: PropTypes.string.isRequired
    };

    const renderEnum = ({ value, path, remove, schemaNode }) => {
        if (value === null || value === undefined) {
            value = "";
        }
        return (
            <div className="input-group">
                <select value={value} onChange={e => onChangeString(path, e.target.value)} className="form-control" >
                    {renderEnumOptions(value, schemaNode)}
                </select>
                {getValidationIcon(path)}
                {getRemoveIcon(remove, path)}
            </div>
        );
    }
    renderEnum.propTypes = {
        value: PropTypes.string,
        path: PropTypes.string.isRequired,
        remove: PropTypes.bool,
        schemaNode: PropTypes.object.isRequired
    };

    const renderEnumOptions = (value, node) => {
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
        if (!nullOptionAdded && (!value || isNullable(node))) {
            options.unshift(<option key={null} value={null}>{getText("selectNull")}</option>);
        }
        return options;
    }
    renderEnumOptions.propTypes = {
        value: PropTypes.string,
        enum: PropTypes.array.isRequired,
        oneOf: PropTypes.object.isRequired
    };

    const renderString = ({ value, path, remove, autoFocus }) => {
        if (value === null || value === undefined) {
            value = "";
        }
        return (
            <div className="input-group">
                <input
                    type="text"
                    className="form-control"
                    onChange={e => onChangeString(path, e.target.value)}
                    value={value}
                    autoFocus={autoFocus}
                />
                {getValidationIcon(path)}
                {getRemoveIcon(remove, path)}
            </div>
        );
    }
    renderString.propTypes = {
        value: PropTypes.bool,
        path: PropTypes.string.isRequired,
        remove: PropTypes.bool,
        autoFocus: PropTypes.bool
    };

    const renderNumber = ({ value, path, remove, autoFocus }) => {
        if (value === null || value === undefined) {
            value = "";
        }
        return (
            <div className="input-group">
                <input
                    type="number"
                    className="form-control"
                    onChange={e => onChangeNumber(path, e.target.value)}
                    value={value}
                    autoFocus={autoFocus}
                />
                {getValidationIcon(path)}
                {getRemoveIcon(remove, path)}
            </div>
        );
    }
    renderNumber.propTypes = {
        value: PropTypes.bool,
        path: PropTypes.string.isRequired,
        remove: PropTypes.bool,
        autoFocus: PropTypes.bool
    };

    const renderInteger = ({ value, path, remove, autoFocus }) => {
        if (value === null || value === undefined) {
            value = "";
        }
        return (
            <div className="input-group">
                <input
                    type="number"
                    className="form-control"
                    onChange={e => onChangeInteger(path, e.target.value)}
                    value={value}
                    autoFocus={autoFocus}
                />
                {getValidationIcon(path)}
                {getRemoveIcon(remove, path)}
            </div>
        );
    }
    renderInteger.propTypes = {
        value: PropTypes.bool,
        path: PropTypes.string.isRequired,
        remove: PropTypes.bool,
        autoFocus: PropTypes.bool
    };

    const renderBool = ({ value, path, schemaNode, remove, autoFocus }) => {
        return (
            <div className="input-group">
                <label>
                    <input
                        type="radio"
                        checked={value === false}
                        onChange={() => updateCopy(path, false)}
                        autoFocus={autoFocus}
                    />
                    {getText("boolYes")}
                </label>
                <label>
                    <input
                        type="radio"
                        checked={value === true}
                        onChange={() => updateCopy(path, true)}
                    />
                    {getText("boolNo")}
                </label>
                {isNullable(schemaNode) &&
                    <label>
                        <input
                            type="radio"
                            checked={value === null || value === undefined}
                            onChange={() => updateCopy(path, null)}
                        />
                        {getText("boolNull")}
                    </label>
                }
                {getValidationIcon(path)}
                {getRemoveIcon(remove, path)}
            </div>
        );
    }
    renderBool.propTypes = {
        value: PropTypes.bool,
        path: PropTypes.string.isRequired,
        schemaNode: PropTypes.object.isRequired,
        remove: PropTypes.bool,
        autoFocus: PropTypes.bool
    };

    const renderNode = (props) => {
        //Follow reference
        props.schemaNode = updateRef(props.schemaNode);
        const type = getType(props.schemaNode);
        // if (onRender) {
        //     return onRender({...props, type})
        // }
        if (props.schemaNode.enum || props.schemaNode.oneOf) {
            return renderEnum(props);
        }
        switch (type) {
            case "object":
                return renderObject(props);
            case "array":
                return renderArray(props);
            case "string":
                return renderString(props);
            case "boolean":
                return renderBool(props);
            case "number":
                return renderNumber(props);
            case "integer":
                return renderInteger(props);
            default:
                console.warn("unknown type ", props.schemaNode);
                return <div>unknown type {type}</div>
        }
    }
    renderNode.propTypes = {
        schemaNode: PropTypes.object.isRequired
    };

    if (!errors) {
        return null;
    }
    return (
        <div className="json-schema-form">
            {renderNode({ value: model, schemaNode: schema })}
        </div>
    );
};
JsonSchemaForm.propTypes = {
    schema: PropTypes.object.isRequired,
    model: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    onRender: PropTypes.func,
    texts: PropTypes.object
};
export default JsonSchemaForm;

/******************************
* ********** PRIVATE **********
*******************************/

const addRow = (schemaNode) => {
    if (schemaNode.type) {
        return !schemaNode.type.includes("array") && !schemaNode.type.includes("object");
    }
    return true;
}

const getTitle = (schemaNode, fieldName) => {
    const title = schemaNode.title || fieldName;
    return (
        <React.Fragment>
            {title}
            {schemaNode.description &&
                <Glyph type="question-sign" title={schemaNode.description} style={{ marginLeft: 5 }} />
            }
        </React.Fragment>
    );
}

const updatePath = (path, fieldName) => {
    if (!path) {
        return fieldName;
    }
    if (typeof fieldName === "string") {
        return path + "." + fieldName;
    }
    if (typeof fieldName === "number") {
        return path + "[" + fieldName + "]";
    }
}

const getType = (schemaNode) => {
    if (!schemaNode.type) {
        return null;
    }
    return schemaNode.type.split(",")[0].trim();
}

const isNullable = (schemaNode) => {
    if (schemaNode.enum) {
        return schemaNode.enum.indexOf(null) > -1
    }
    if (schemaNode.oneOf) {
        return !!schemaNode.oneOf.find(oneOf => oneOf.const === null);
    }
    return schemaNode.type.includes("null");
}

const getErrorPath = (error) => {
    let path = error.property;
    //Required field is missing is a special case.
    if (error.name === "required") {
        path += "." + error.argument;
    }
    return path.substring(9);
}

const Row = ({ left, right }) => {
    return (
        <div className="row">
            <div className="col-xs-4">
                {left}
            </div>
            <div className="col-xs-8">
                {right}
            </div>
        </div>
    );
}
Row.propTypes = {
    left: PropTypes.node,
    right: PropTypes.node
};