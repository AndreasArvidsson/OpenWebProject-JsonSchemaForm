import React from "react";
import PropTypes from "prop-types";
import Util from "./Util";
import Title from "./Title";
import ValidationIcon from "./ValidationIcon";
import AddIcon from "./AddIcon";
import RemoveIcon from "./RemoveIcon";
import BadgeIcon from "./BadgeIcon";

const ArrayNode = ({ value, path, schemaNode, removable, fieldName, renderNode, getNew, updateModel, removePath, errors }) => {
    const addNew = () => updateModel(path, getNew(schemaNode));
    const addNewChild = () => updateModel(Util.updatePath(path, value.length), getNew(schemaNode.items));

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
                    {value &&
                        <React.Fragment>
                            <AddIcon onClick={addNewChild} />
                            <BadgeIcon value={value.length} />
                        </React.Fragment>
                    }
                    <ValidationIcon errors={errors} />
                    {(!value && !removable) && <AddIcon onClick={addNew} />}
                    {removable && <RemoveIcon path={path} onClick={removePath} />}
                </span>
            </div>

            {value &&
                <div className="panel-body">
                    {value.map((v, i) => {
                        const p = Util.updatePath(path, i);
                        return <React.Fragment key={p}>
                            {renderNode({
                                value: v,
                                path: p,
                                schemaNode: schemaNode.items,
                                fieldName: i.toString(),
                                removable: true
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
    updateModel: PropTypes.func.isRequired,
    removePath: PropTypes.func.isRequired,
    errors: PropTypes.arrayOf(PropTypes.string)
};
export default ArrayNode;