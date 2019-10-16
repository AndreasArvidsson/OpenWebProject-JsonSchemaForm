import React, { useState } from "react";
import PropTypes from "prop-types";
import Util from "./Util";
import ValidationIcon from "./ValidationIcon";
import AddIcon from "./AddIcon";
import RemoveIcon from "./RemoveIcon";
import BadgeIcon from "./BadgeIcon";
import ObjectTitle from "./ObjectTitle";

const ArrayNode = ({ value, path, schemaNode, removable, nullable, fieldName,
    renderNode, getNew, onChange, onRemove, error, disabled = {} }) => {
    const [show, setShow] = useState(true);

    return (
        <div className={"panel panel-" + (value ? "default" : "warning")}>

            <div className="panel-heading">
                <span className="input-group">
                    <span className="panel-title">
                        <ObjectTitle disabled={!value} show={show} setShow={setShow} schemaNode={schemaNode} fieldName={fieldName} />
                    </span>
                    {value &&
                        <React.Fragment>
                            <AddIcon onClick={() => onChange(Util.updatePath(path, value.length), getNew(schemaNode.items))} />
                            <BadgeIcon value={value.length} />
                        </React.Fragment>
                    }
                    <ValidationIcon error={error} />
                    {!value && <AddIcon onClick={() => onChange(path, [])} />}
                    {(value && (removable || nullable)) && <RemoveIcon path={path} onClick={onRemove} />}
                </span>
            </div>

            {(value && show) &&
                <div className="panel-body">
                    {value.map((v, i) => {
                        const p = Util.updatePath(path, i);
                        return <React.Fragment key={p}>
                            {renderNode({
                                value: v,
                                path: p,
                                schemaNode: schemaNode.items,
                                fieldName: i.toString(),
                                removable: true,
                                parentType: "array",
                                disabled: disabled[i]
                            })}
                        </React.Fragment>
                    })}
                </div>
            }

        </div>
    );
};
ArrayNode.propTypes = {
    value: PropTypes.array,
    path: PropTypes.string.isRequired,
    removable: PropTypes.bool,
    schemaNode: PropTypes.object.isRequired,
    fieldName: PropTypes.string.isRequired,
    renderNode: PropTypes.func.isRequired,
    getNew: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    onRemove: PropTypes.func.isRequired,
    error: PropTypes.string,
    disabled: PropTypes.object,
    nullable: PropTypes.bool
};
export default ArrayNode;