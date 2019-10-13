import "owp.core/object/map";
import React, { useState } from "react";
import PropTypes from "prop-types";
import Util from "./Util";
import ValidationIcon from "./ValidationIcon";
import AddIcon from "./AddIcon";
import RemoveIcon from "./RemoveIcon";
import ObjectTitle from "./ObjectTitle";

const ObjectNode = ({ value, path, schemaNode, removable, nullable, fieldName, 
    renderNode, onChange, onRemove, error, disabled = {} }) => {
    
    const [show, setShow] = useState(true);
    const addNew = () => onChange(path, {});

    const getContent = () => {
        return schemaNode.properties.map((schemaNode, fieldName) => {
            const p = Util.updatePath(path, fieldName);
            return <React.Fragment key={p}>
                {renderNode({
                    value: value[fieldName],
                    path: p,
                    parentType: "object",
                    disabled: disabled[fieldName],
                    nullable: isNullable(fieldName),
                    schemaNode, fieldName,
                })}
            </React.Fragment>
        })
    };

    const isNullable = (fieldName) => {
        return !schemaNode.required 
        || !schemaNode.required.includes(fieldName);
    };

    //Root node. Dont add panel.
    if (!path) {
        return (
            <div>
                {getContent()}
            </div>
        );
    }

    return (
        <div className={"panel panel-" + (value ? "default" : "warning")}>
            <div className="panel-heading">
                <span className="input-group">
                    <ObjectTitle disabled={!value} show={show} setShow={setShow} schemaNode={schemaNode} fieldName={fieldName} />
                    <ValidationIcon error={error} />
                    {!value && <AddIcon onClick={addNew} />}
                    {(value && (removable || nullable)) && <RemoveIcon path={path} onClick={onRemove} />}
                </span>
            </div>
            {(value && show) &&
                <div className="panel-body">
                    {getContent()}
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
    error: PropTypes.string,
    disabled: PropTypes.object,
    nullable: PropTypes.bool
};
export default ObjectNode;