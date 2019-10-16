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

class JsonSchemaForm extends React.PureComponent {

    constructor(props) {
        super(props);
        this.getNew = schemaNode => Util.getNew(props.schema, schemaNode);
        this.autoFocus = true;
        this.schema = props.schema;
        this.texts = props.texts || {};
        this.getNode = this.getNode.bind(this);
        this.renderNode = this.renderNode.bind(this);
        this.defaultRenderMethod = this.defaultRenderMethod.bind(this);
        this.applyAutoFocus = this.applyAutoFocus.bind(this);
        this.onRender = props.onRender;
        this.onChange = props.onChange;
        this.onRemove = props.onRemove;
    }

    getNode (nodeProps) {
        if (nodeProps.schemaNode.enum || (!nodeProps.schemaNode.type && nodeProps.schemaNode.oneOf)) {
            return <EnumNode {...nodeProps}
                onChange={this.onChange}
                onRemove={this.onRemove}
                texts={this.texts}
            />
        }
        const type = Util.getType(nodeProps.schemaNode);
        switch (type) {
            case "object":
                return <ObjectNode 
                    {...nodeProps}
                    onChange={this.onChange}
                    onRemove={this.onRemove}
                    renderNode={this.renderNode}
                />
            case "array":
                return <ArrayNode 
                    {...nodeProps}
                    onChange={this.onChange}
                    onRemove={this.onRemove}
                    renderNode={this.renderNode}
                    getNew={this.getNew}
                />
            case "string":
                return <StringNode 
                    {...nodeProps}
                    onChange={this.onChange}
                    onRemove={this.onRemove}
                />
            case "boolean":
                return <BoolNode 
                    {...nodeProps}
                    onChange={this.onChange}
                    onRemove={this.onRemove}
                    texts={this.texts}
                />
            case "number":
                return <NumberNode 
                    {...nodeProps}
                    onChange={this.onChange}
                    onRemove={this.onRemove}
                />
            case "integer":
                return <IntegerNode
                    {...nodeProps}
                    onChange={this.onChange}
                    onRemove={this.onRemove}
                />
            default:
                console.warn("Unknown type ", nodeProps.schemaNode);
                return <div>Unknown type {type}</div>
        }
    }

    applyAutoFocus (nodeProps) {
        if (this.autoFocus && !nodeProps.disabled
            && nodeProps.schemaNode.type !== "object"
            && nodeProps.schemaNode.type !== "array") {
            this.autoFocus = false;
            nodeProps.autoFocus = true;
        }
    }

    defaultRenderMethod (nodeProps) {
        this.applyAutoFocus(nodeProps);
        const node = this.getNode(nodeProps);
        if (nodeProps.parentType === "object" && Util.shouldAddRow(nodeProps.schemaNode)) {
            return <Row
                left={<Title schemaNode={nodeProps.schemaNode} fieldName={nodeProps.fieldName} />}
                right={node}
            />
        }
        return node;
    }

    renderNode (nodeProps) {
        nodeProps = {
            ...nodeProps,
            error: this.props.errors ? this.props.errors[nodeProps.path] : null,
            schemaNode: Util.updateRef(this.schema, nodeProps.schemaNode)
        };
        if (this.onRender) {
            return this.onRender(nodeProps, this.defaultRenderMethod);
        }
        return this.defaultRenderMethod(nodeProps);
    }

    //Render root document.
    render() {
        return (
            <div className="json-schema-form">
                {this.renderNode({ value: this.props.instance, schemaNode: this.schema, fieldName: "", path: "" })}
            </div>
        );
    }
}

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