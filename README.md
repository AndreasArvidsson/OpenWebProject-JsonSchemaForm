# OpenWebProject JsonSchemaForm

**Json schema form for React**

* Automatically creates React form from [Json Schema](https://json-schema.org)
* Uses bootstrap 3 styles

## Installation
`npm install owp.json-schema-form --save`

## Usage
```javascript
import JsonSchemaForm from "owp.json-schema-form";

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
    ],
    "properties": {
        "requiredString": {
            "type": "string",
            "title": "Required string",
            "description": "This string is required"
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
        "OptionalBool": {
            "type": "boolean, null",
            "title": "Optional bool",
            "description": "This bool is optional"
        },
        "optionalEnum": {
            "enum": [
                null, "a", "b", "c"
            ],
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
        "requiredArray": {
            "type": "array",
            "title": "Required array",
            "minItems": 1,
            "items": {
                "type": "string"
            }
        }
    }
};
const model = {
    requiredArray: null
};

const texts = {
    boolYes: "Okay"
};

<JsonSchemaForm schema={schema} model={model} texts={texts} />
```