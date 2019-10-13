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

const JsonSchemaForm = ({ schema, instance, onChange, onRemove, onRender, errors = {}, texts = {} }) => {
    const getNew = schemaNode => Util.getNew(schema, schemaNode);
    let autoFocus = true;

    const getNode = (nodeProps) => {
        if (nodeProps.schemaNode.enum || (!nodeProps.schemaNode.type && nodeProps.schemaNode.oneOf)) {
            return <EnumNode {...nodeProps}
                onChange={onChange}
                onRemove={onRemove}
                texts={texts}
            />
        }
        const type = Util.getType(nodeProps.schemaNode);
        switch (type) {
            case "object":
                return <ObjectNode 
                    {...nodeProps}
                    onChange={onChange}
                    onRemove={onRemove}
                    renderNode={renderNode}
                />
            case "array":
                return <ArrayNode 
                    {...nodeProps}
                    onChange={onChange}
                    onRemove={onRemove}
                    renderNode={renderNode}
                    getNew={getNew}
                />
            case "string":
                return <StringNode 
                    {...nodeProps}
                    onChange={onChange}
                    onRemove={onRemove}
                />
            case "boolean":
                return <BoolNode 
                    {...nodeProps}
                    onChange={onChange}
                    onRemove={onRemove}
                    texts={texts}
                />
            case "number":
                return <NumberNode 
                    {...nodeProps}
                    onChange={onChange}
                    onRemove={onRemove}
                />
            case "integer":
                return <IntegerNode
                    {...nodeProps}
                    onChange={onChange}
                    onRemove={onRemove}
                />
            default:
                console.warn("Unknown type ", nodeProps.schemaNode);
                return <div>Unknown type {type}</div>
        }
    };

    const applyAutoFocus = (nodeProps) => {
        if (autoFocus && !nodeProps.disabled
            && nodeProps.schemaNode.type !== "object"
            && nodeProps.schemaNode.type !== "array") {
            autoFocus = false;
            nodeProps.autoFocus = true;
        }
    }

    const defaultRenderMethod = (nodeProps) => {
        applyAutoFocus(nodeProps);
        const node = getNode(nodeProps);
        if (nodeProps.parentType === "object" && Util.shouldAddRow(nodeProps.schemaNode)) {
            return <Row
                left={<Title schemaNode={nodeProps.schemaNode} fieldName={nodeProps.fieldName} />}
                right={node}
            />
        }
        return node;
    };

    const renderNode = (nodeProps) => {
        nodeProps = {
            ...nodeProps,
            error: errors[nodeProps.path],
            schemaNode: Util.updateRef(schema, nodeProps.schemaNode)
        };
        if (onRender) {
            return onRender(nodeProps, defaultRenderMethod);
        }
        return defaultRenderMethod(nodeProps);
    };

    //Render root document.
    return (
        <div className="json-schema-form">
            {renderNode({ value: instance, schemaNode: schema, fieldName: "", path: "" })}
        </div>
    );
};
JsonSchemaForm.propTypes = {
    schema: PropTypes.object.isRequired,
    instance: PropTypes.object.isRequired,
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