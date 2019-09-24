import React from "react";
import ReactDOM from "react-dom";
import JsonSchemaForm from "../index.js";
import "bootstrap/dist/css/bootstrap.css";

console.log("test.js")

const schema = {
    "$schema": "http://json-schema.org/draft-06/schema#",
    "definitions": {
        "optionalString": {
            "type": "string, null",
            "title": "Optional string"
        }
    },
    "type": "object",
    "additionalProperties": false,
    "required": [
        "requiredString",
        "requiredNumber",
        "requiredBool",
        "requiredObject",
        "requiredInt",
        "requiredEnum"
        // "requiredArray"
    ],
    "properties": {
        "requiredString": {
            "type": "string",
            "title": "Required string",
            "description": "This string is required"
        },
        "optionalString": {
            "$ref": "#/definitions/optionalString"
        },
        "requiredNumber": {
            "type": "number",
            "title": "Required number",
            "description": "This number is required",
            "minimum": 5
        },
        "OptionalNumber": {
            "type": "number, null",
            "title": "Optional number",
        },
        "requiredInt": {
            "type": "integer",
            "title": "Required int",
            "description": "This int is required",
            "minimum": -2
        },
        "OptionalInt": {
            "type": "integer, null",
            "title": "Optional int",
        },
        "requiredBool": {
            "type": "boolean",
            "title": "Required bool"
        },
        "OptionalBool": {
            "type": "boolean, null",
            "title": "Optional bool",
            "description": "This bool is optional"
        },
        "requiredEnum": {
            "enum": [
                "a", "b", "c"
            ],
            "title": "Required enum",
        },
        "optionalEnum": {
            "enum": [
                null, "a", "b", "c"
            ],
            // "title": "Optional num",
            "description": "This enum is optional",
        },
        "enumDesc": {
            "oneOf": [
                {
                    "const": null,
                    "title": "No value",
                    "description": "No value is used"
                },
                {
                    "const": "a",
                    "title": "A",
                    "description": "Value A is used"
                },
                {
                    "const": "b",
                    "title": "B",
                    "description": "Value B is used"
                },
                {
                    "const": "c",
                    "title": "C",
                    "description": "Value C is used"
                }
            ],
            "title": "Descriptive enum num",
            "description": "This enum has titles and descriptions",
        },
        "requiredObject": {
            "type": "object",
            "title": "Required object",
            "description": "This object is required",
            "properties": {
                "value": {
                    "type": "string, null",
                }
            }
        },
        "optionalObject": {
            "type": "object, null",
            "title": "Optional object",
            "properties": {
                "value": {
                    "type": "string, null",
                }
            }
        },
        "requiredArray": {
            "type": "array",
            "title": "Required array",
            "minItems": 1,
            "items": {
                "type": "string"
            }
        },
        "optionalArray": {
            "type": "array, null",
            "title": "Optional array",
            "description": "This array is optional",
            "items": {
                "type": "string, null"
            }
        },

    }
};
const model = {
    requiredArray: null
};

ReactDOM.render(
    <div>
        <h1>Test</h1>
        <JsonSchemaForm schema={schema} model={model} texts={{ boolYes: "Okay" }} />
    </div>,
    document.getElementById("root")
);