import React from "react";
import PropTypes from "prop-types";
import Util from "./Util";
import Title from "./Title";
import ValidationIcon from "./ValidationIcon";
import AddIcon from "./AddIcon";
import RemoveIcon from "./RemoveIcon";

const ObjectNode = ({ value, path, schemaNode, removable, fieldName, renderNode, getNew, updateModel, removePath, errors, updateRef }) => {
    const addNew = () => updateModel(path, getNew(schemaNode));

    const getContent = (autoFocus) => {
        return schemaNode.properties.map((schemaNode, fieldName) => {
            return renderObjectField(renderNode, updateRef, {
                value: value[fieldName],
                path: Util.updatePath(path, fieldName),
                autoFocus: autoFocus-- > 0,
                schemaNode, fieldName
            });
        })
    };

    //Root node. Dont add panel.
    if (!path) {
        return (
            <div>
                {getContent(1)}
            </div>
        );
    }

    if (!removable) {
        removable = value && Util.isNullable(schemaNode);
    }

    return (
        <div className={"panel panel-" + (value ? "default" : "warning")}>
            <div className="panel-heading">
                <span className="input-group">
                    <span className="panel-title">
                        <Title schemaNode={schemaNode} fieldName={fieldName} />
                    </span>
                    <ValidationIcon errors={errors} />
                    {(!value && !removable) && <AddIcon onClick={addNew} />}
                    {removable && <RemoveIcon path={path} onClick={removePath} />}
                </span>
            </div>
            {value &&
                <div className="panel-body">
                    {getContent(0)}
                </div>
            }
        </div>
    );
};
ObjectNode.propTypes = {
    value: PropTypes.object,
    path: PropTypes.string.isRequired,
    removable: PropTypes.bool,
    schemaNode: PropTypes.object.isRequired,
    fieldName: PropTypes.string.isRequired,
    renderNode: PropTypes.func.isRequired,
    getNew: PropTypes.func.isRequired,
    updateModel: PropTypes.func.isRequired,
    removePath: PropTypes.func.isRequired,
    errors: PropTypes.arrayOf(PropTypes.string),
    updateRef: PropTypes.func.isRequired
};
export default ObjectNode;

const renderObjectField = (renderNode, updateRef, props) => {
    props.schemaNode = updateRef(props.schemaNode);
    const node = renderNode(props);
    if (Util.shouldAddRow(props.schemaNode)) {
        return (
            <Row key={props.fieldName}
                left={<Title schemaNode={props.schemaNode} fieldName={props.fieldName} />}
                right={node}
            />
        );
    }
    return (
        <React.Fragment key={props.fieldName}>
            {node}
        </React.Fragment>
    );
}
renderObjectField.propTypes = {
    schemaNode: PropTypes.object.isRequired,
    fieldName: PropTypes.string.isRequired
};

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