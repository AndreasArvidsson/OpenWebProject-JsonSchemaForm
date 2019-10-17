import "owp.core/string/replaceAll";
import "owp.core/string/capitalizeFirst";
import _get from "lodash.get";
import _unset from "lodash.unset";

const Util = {

    updateRef: function (schema, schemaNode) {
        if (schemaNode["$ref"]) {
            const path = schemaNode["$ref"].substring(2).replaceAll("/", ".");
            return _get(schema, path);
        }
        return schemaNode;
    },

    shouldAddRow: function (schemaNode) {
        if (schemaNode.type) {
            return !schemaNode.type.includes("array") && !schemaNode.type.includes("object");
        }
        return true;
    },

    updatePath: function (path, fieldName) {
        if (!path) {
            return fieldName;
        }
        if (typeof fieldName === "string") {
            return path + "." + fieldName;
        }
        if (typeof fieldName === "number") {
            return path + "[" + fieldName + "]";
        }
    },

    getNew: function (schema, schemaNode) {
        schemaNode = this.updateRef(schema, schemaNode);
        const type = this.getType(schemaNode);
        switch (type) {
            case "object":
                return {};
            case "array":
                return [];
            case "string":
                return "";
            case "number":
            case "integer":
                return 0;
            default:
                return null;
        }
    },

    parseJsonValidation: function (validation) {
        const res = {};
        validation.errors.forEach(error => {
            const path = getErrorPath(error);
            const msg = error.message.capitalizeFirst();
            if (res[path]) {
                res[path] += "\n" + msg;
            }
            res[path] = msg;
        });
        return res;
    },

    remove: function (model, path) {
        //Array path. Remove item from array.
        if (path.endsWith("]")) {
            const i = path.lastIndexOf("[");
            const parentPath = path.substring(0, i);
            const index = parseInt(path.substring(i + 1, path.length - 1));
            _get(model, parentPath).splice(index, 1);
        }
        //Object path. Unset property.
        else {
            _unset(model, path);
        }
    }

};
export default Util;

const getErrorPath = (error) => {
    let path = error.property;
    //Required field is missing is a special case.
    if (error.name === "required") {
        path += "." + error.argument;
    }
    return path.substring(9);
};