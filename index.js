/**
 * @author Andreas Arvidsson
 * https://github.com/AndreasArvidsson/OpenWebProject-JsonSchemaForm
 */
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import _set from "lodash.set";
import uuid from "uuid/v4";
import "./styles.css";
import "./Object";
import "./String";
import Row from "./Row";
import DefaultTexts from "./DefaultTexts";
import Util from "./Util";
import ValidationIcon from "./ValidationIcon";
import RemoveIcon from "./RemoveIcon";
import AddIcon from "./AddIcon";
import Title from "./Title";
import BoolInput from "./BoolInput";
import NumberInput from "./NumberInput";
import IntegerInput from "./IntegerInput";
import EnumInput from "./EnumInput";
import StringInput from "./StringInput";

const JsonSchemaForm = ({ schema, model, onChange, onRender = {}, texts = {} }) => {
    const [errors, setErrors] = useState();

    useEffect(() => {
        const newErrors = getErrors(model);
        if (onChange) {
            onChange(model, newErrors);
        }
        setErrors(newErrors);
    }, [model]);

    const updateRef = schemaNode => Util.updateRef(schema, schemaNode);
    const getText = field => texts[field] || DefaultTexts[field] || "Missing text";
    const getNew = schemaNode => Util.getNew(schema, schemaNode);
    const getErrors = newModel => Util.getErrors(newModel, schema);
    const getValidationIcon = path => <ValidationIcon errors={errors[path]} />;
    const getRemoveIcon = (remove, path) => remove && <RemoveIcon path={path} onClick={onRemove} />;

    const onRemove = (path) => {
        const newModel = Util.remove(model, path);
        const newErrors = getErrors(newModel);
        if (onChange) {
            onChange(newModel, newErrors, path);
        }
        setErrors(newErrors);
    }

    const updateModel = (path, value) => {
        const newModel = { ...model };
        _set(newModel, path, value);
        const newErrors = getErrors(newModel);
        setErrors(newErrors);
        if (onChange) {
            onChange(newModel, newErrors, path, value);
        }
    }

    const onChangeString = (path, value) => {
        updateModel(path, value === "" ? null : value);
    }

    const onChangeNumber = (path, value) => {
        updateModel(path, value === "" ? null : Number.parseFloat(value));
    }

    const onChangeInteger = (path, value) => {
        updateModel(path, value === "" ? null : Number.parseInt(value));
    }

    const renderObject = ({ value, path, schemaNode, remove, fieldName }) => {
        const addNew = () => updateModel(path, getNew(schemaNode));

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
                                path: Util.updatePath(path, fieldName),
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
            remove = value && Util.isNullable(schemaNode);
        }
        const className = value ? "default" : "warning";
        return (
            <div className={"panel panel-" + className}>
                <div className="panel-heading">
                    <span className="input-group">
                        <span className="panel-title">
                            <Title schemaNode={schemaNode} fieldName={fieldName} />
                        </span>
                        {getValidationIcon(path)}
                        {(!value && !remove) && <AddIcon onClick={addNew} />}
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
                    Util.shouldAddRow(props.schemaNode)
                        ? <Row
                            left={
                                <Title schemaNode={props.schemaNode} fieldName={props.fieldName} />
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
        const addNew = () => updateModel(path, getNew(schemaNode));
        const addNewChild = () => updateModel(Util.updatePath(path, value.length), getNew(schemaNode.items));
        
        if (!remove) {
            remove = value && Util.isNullable(schemaNode);
        }
        const key = uuid();
        const className = value ? "default" : "warning";
        return (
            <div className={"panel panel-" + className}>
                <div className="panel-heading">
                    <span className="input-group">
                        <span className="panel-title">
                            <Title schemaNode={schemaNode} fieldName={fieldName} />
                        </span>
                        {value &&
                            <React.Fragment>
                                <AddIcon onClick={addNewChild} />
                                <span className="input-group-addon" style={{ padding: 3, paddingRight: 7 }}>
                                    <span className="badge" >{value.length}</span>
                                </span>
                            </React.Fragment>
                        }
                        {getValidationIcon(path)}
                        {(!value && !remove) && <AddIcon onClick={addNew} />}
                        {getRemoveIcon(remove, path)}
                    </span>
                </div>
                {value &&
                    <div className="panel-body">
                        {value && value.map((v, i) =>
                            <React.Fragment key={key + i}>
                                {renderNode({
                                    value: v,
                                    path: Util.updatePath(path, i),
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

     const defaultRenderNode = (props) => {
        if (props.schemaNode.enum || props.schemaNode.oneOf) {
            return <EnumInput {...props} onChange={onChangeString} />
        }
        const type = Util.getType(props.schemaNode);
        switch (type) {
            case "object":
                return renderObject(props);
            case "array":
                return renderArray(props);
            case "string":
                return <StringInput  {...props} onChange={onChangeString} />
            case "boolean":
                return <BoolInput {...props} onChange={updateModel} />
            case "number":
                return <NumberInput {...props} onChange={onChangeNumber} />
            case "integer":
                return <IntegerInput {...props} onChange={onChangeInteger} />
            default:
                console.warn("unknown type ", props.schemaNode);
                return <div>unknown type {type}</div>
        }
    };
    defaultRenderNode.propTypes = {
        schemaNode: PropTypes.object.isRequired,
        path: PropTypes.string.isRequired
    };

    /*eslint-disable */
    const renderNode = (props) => {
        props = {
            ...props, 
            errors: errors[props.path],
            getText,
            onRemove
        };

        //Follow reference
        props.schemaNode = updateRef(props.schemaNode);

        if (onRender[props.path]) {
            return onRender[props.path](props, defaultRenderNode);
        }
        if (onRender[""]) {
            return onRender[""](props, defaultRenderNode);
        }
        
        return defaultRenderNode(props);
    };
    renderNode.propTypes = {
        schemaNode: PropTypes.object.isRequired,
        path: PropTypes.string.isRequired
    };
    /*eslint-enable */

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
    onRender: PropTypes.object,
    texts: PropTypes.object
};
export default JsonSchemaForm;