import "owp.core/object/map";
import React, { useState } from "react";
import PropTypes from "prop-types";
import Util from "./Util";
import ValidationIcon from "./ValidationIcon";
import AddIcon from "./AddIcon";
import RemoveIcon from "./RemoveIcon";
import ObjectTitle from "./ObjectTitle";

const ObjectNode = ({ value, path, schemaNode, removable, fieldName, renderNode, onChange, onRemove, error }) => {
    const [show, setShow] = useState(true);
    const addNew = () => onChange(path, {});

    const getContent = (autoFocus) => {
        return schemaNode.properties.map((schemaNode, fieldName) => {
            const p = Util.updatePath(path, fieldName);
            return <React.Fragment key={p}>
                {renderNode({
                    value: value[fieldName],
                    path: p,
                    autoFocus: autoFocus-- > 0,
                    schemaNode, fieldName,
                    parentType: "object"
                })}
            </React.Fragment>
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
                    <ObjectTitle disabled={!value} show={show} setShow={setShow} schemaNode={schemaNode} fieldName={fieldName} />
                    <ValidationIcon error={error} />
                    {(!value && !removable) && <AddIcon onClick={addNew} />}
                    {removable && <RemoveIcon path={path} onClick={onRemove} />}
                </span>
            </div>
            {(value && show) &&
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
    onChange: PropTypes.func.isRequired,
    onRemove: PropTypes.func.isRequired,
    error: PropTypes.string
};
export default ObjectNode;