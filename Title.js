import React from "react";
import PropTypes from "prop-types";
import Glyph from "owp.glyphicons";

const Title = ({ schemaNode, fieldName }) => {
    return (
        <React.Fragment>
            {schemaNode.title || fieldName}
            {schemaNode.description &&
                <Glyph type="question-sign" title={schemaNode.description} style={{ marginLeft: 5 }} />
            }
        </React.Fragment>
    );
}
Title.propTypes = {
    schemaNode: PropTypes.object.isRequired,
    fieldName: PropTypes.string.isRequired
};
export default React.memo(Title);