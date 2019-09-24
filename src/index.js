/**
 * @author Andreas Arvidsson
 * https://github.com/AndreasArvidsson/OpenWebProject-JsonSchemaForm
 */
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import _set from "lodash.set";
import "./styles.css";
import "../Object"; //TODO
import "../String";
import DefaultTexts from "./DefaultTexts";
import Util from "./Util";
import ObjectNode from "./ObjectNode";
import ArrayNode from "./ArrayNode";
import StringNode from "./StringNode";
import EnumNode from "./EnumNode";
import NumberNode from "./NumberNode";
import IntegerNode from "./IntegerNode";
import BoolNode from "./BoolNode";

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
    const getText = field => texts[field] || DefaultTexts[field] || "[Missing text]";
    const getNew = schemaNode => Util.getNew(schema, schemaNode);
    const getErrors = newModel => Util.getErrors(newModel, schema);

    const removePath = (path) => {
        const newModel = Util.remove(model, path);
        const newErrors = getErrors(newModel);
        if (onChange) {
            onChange(newModel, newErrors, path);
        }
        setErrors(newErrors);
    };

    const updateModel = (path, value) => {
        const newModel = { ...model };
        _set(newModel, path, value);
        const newErrors = getErrors(newModel);
        setErrors(newErrors);
        if (onChange) {
            onChange(newModel, newErrors, path, value);
        }
    };

    const defaultRenderNode = (props) => {
        if (props.schemaNode.enum || props.schemaNode.oneOf) {
            return <EnumNode {...props} />
        }
        const type = Util.getType(props.schemaNode);
        switch (type) {
            case "object":
                return <ObjectNode {...props} renderNode={renderNode} getNew={getNew} updateRef={updateRef} />
            case "array":
                return <ArrayNode {...props} renderNode={renderNode} getNew={getNew} />
            case "string":
                return <StringNode  {...props} />
            case "boolean":
                return <BoolNode {...props} />
            case "number":
                return <NumberNode {...props} />
            case "integer":
                return <IntegerNode {...props} />
            default:
                console.warn("unknown type ", props.schemaNode);
                return <div>unknown type {type}</div>
        }
    };
    defaultRenderNode.propTypes = {
        schemaNode: PropTypes.object.isRequired,
        path: PropTypes.string.isRequired
    };

    /* eslint-disable react/prop-types */
    const renderNode = (props) => {
        props = {
            ...props,
            errors: errors[props.path],
            getText,
            removePath,
            updateModel
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
    /* eslint-enable react/prop-types */

    //Still loading for the first time.
    if (!errors) {
        return null;
    }
    //Render root document.
    return (
        <div className="json-schema-form">
            {renderNode({ value: model, schemaNode: schema, fieldName: "", path: "" })}
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
