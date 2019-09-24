import jsonSchema from "jsonschema";
import _get from "lodash.get";
import _set from "lodash.set";
const Util = {

    updateRef: function (schema, schemaNode) {
        if (schemaNode["$ref"]) {
            const path = schemaNode["$ref"].substring(2).replaceAll("/", ".");
            return _get(schema, path);
        }
        return schemaNode;
    },

    getType: function (schemaNode) {
        if (!schemaNode.type) {
            return null;
        }
        return schemaNode.type.split(",")[0].trim();
    },

    isNullable: function (schemaNode) {
        if (schemaNode.enum) {
            return schemaNode.enum.indexOf(null) > -1
        }
        if (schemaNode.oneOf) {
            return !!schemaNode.oneOf.find(oneOf => oneOf.const === null);
        }
        return schemaNode.type.includes("null");
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
            default:
                return null;
        }
    },

    getErrors: function (model, schema) {
        const errors = jsonSchema.validate(model, schema).errors;
        const res = {};
        errors.forEach(error => {
            const path = getErrorPath(error);
            if (!res[path]) {
                res[path] = [];
            }
            res[path].push(error.message.capitalizeFirst());
        });
        return res;
    },

    remove: function (model, path) {
        const newModel = { ...model };
        //Array path.
        if (path.endsWith("]")) {
            const i = path.lastIndexOf("[");
            const parentPath = path.substring(0, i);
            const index = parseInt(path.substring(i + 1, path.length - 1));
            _get(newModel, parentPath).splice(index, 1);
        }
        //Object path
        else {
            _set(newModel, path, null);
        }
        return newModel;
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
}