/**
 * @author Andreas Arvidsson
 * https://github.com/AndreasArvidsson/OpenWebProject-JsonSchemaForm
 */
import React from "react";
import PropTypes from "prop-types";
import "./styles.css";
import Util from "./Util";
import ObjectNode from "./ObjectNode";
import ArrayNode from "./ArrayNode";
import StringNode from "./StringNode";
import EnumNode from "./EnumNode";
import NumberNode from "./NumberNode";
import IntegerNode from "./IntegerNode";
import BoolNode from "./BoolNode";
import Row from "./Row";
import Title from "./Title";

/* eslint-disable react/prop-types */ //TODO

const JsonSchemaForm = ({ schema, model, onChange, onRemove, onRender, errors = {}, texts = {} }) => {
    const getNew = schemaNode => Util.getNew(schema, schemaNode);
    let autoFocus = true;

    const getNode = (props) => {
        if (props.schemaNode.enum || props.schemaNode.oneOf) {
            return <EnumNode {...props}
                onChange={onChange}
                onRemove={onRemove}
                texts={texts}
            />
        }
        const type = Util.getType(props.schemaNode);
        switch (type) {
            case "object":
                return <ObjectNode 
                    {...props}
                    onChange={onChange}
                    onRemove={onRemove}
                    renderNode={renderNode}
                />
            case "array":
                return <ArrayNode 
                    {...props}
                    onChange={onChange}
                    onRemove={onRemove}
                    renderNode={renderNode}
                    getNew={getNew}
                />
            case "string":
                return <StringNode 
                    {...props}
                    onChange={onChange}
                    onRemove={onRemove}
                />
            case "boolean":
                return <BoolNode 
                    {...props}
                    onChange={onChange}
                    onRemove={onRemove}
                    texts={texts}
                />
            case "number":
                return <NumberNode 
                    {...props}
                    onChange={onChange}
                    onRemove={onRemove}
                />
            case "integer":
                return <IntegerNode
                    {...props}
                    onChange={onChange}
                    onRemove={onRemove}
                />
            default:
                console.warn("Unknown type ", props.schemaNode);
                return <div>Unknown type {type}</div>
        }
    };
    getNode.propTypes = {
        schemaNode: PropTypes.object.isRequired,
        path: PropTypes.string.isRequired
    };

    const applyAutoFocus = (props) => {
        if (autoFocus && !props.disabled
            && props.schemaNode.type !== "object"
            && props.schemaNode.type !== "array") {
            autoFocus = false;
            props.autoFocus = true;
        }
    }

    const defaultRenderMethod = (props) => {
        applyAutoFocus(props);
        const node = getNode(props);
        if (props.parentType === "object" && Util.shouldAddRow(props.schemaNode)) {
            return <Row
                left={<Title schemaNode={props.schemaNode} fieldName={props.fieldName} />}
                right={node}
            />
        }
        return node;
    };
    defaultRenderMethod.propTypes = {
        schemaNode: PropTypes.object.isRequired,
        path: PropTypes.string.isRequired
    };

    const renderNode = (props) => {
        props = {
            ...props,
            error: errors[props.path],
            schemaNode: Util.updateRef(schema, props.schemaNode)
        };
        if (onRender) {
            return onRender(props, defaultRenderMethod);
        }
        return defaultRenderMethod(props);
    };
    renderNode.propTypes = {
        schemaNode: PropTypes.object.isRequired,
        path: PropTypes.string.isRequired
    };

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
    onRemove: PropTypes.func.isRequired,
    onRender: PropTypes.func,
    errors: PropTypes.object,
    texts: PropTypes.object
};
export default JsonSchemaForm;
export {
    ObjectNode, ArrayNode, StringNode, EnumNode,
    NumberNode, IntegerNode, BoolNode,
    Title, Row, Util
};