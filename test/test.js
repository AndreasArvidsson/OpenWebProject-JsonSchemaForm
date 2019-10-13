import React, { useState } from "react";
import ReactDOM from "react-dom";
import "bootstrap/dist/css/bootstrap.css";
import schema from "./schemaSample";
import modelSample from "./modelSample";
import _set from "lodash.set";
import jsonSchema from "jsonschema";
import JsonSchemaForm, { Util } from "../src/index.js";

const m = {
    value1: "aasdassad",
    // value2: "as"
};
const s = {
    type: "object",
    // allOf: [
    //     {
    //         required: ["value1"]
    //     },
    //     {
    //         required: ["value2"]
    //     }
    // ],
    
    // dependencies: {
    //     value:    ["value2"]
    // },
    properties: {
        value1: {
            type: "string",
            const: 6
            // maxLength: 2,
            // pattern: "\\d"
        },
        value2: {
            type: "string",
            // maxLength: 2,
            // pattern: "\\d"
        }
    }
};

const validation = jsonSchema.validate(m, s);
console.log(JSON.stringify(validation.errors, undefined, 4));

console.log("test.js")
/* eslint-disable react/prop-types */ //TODO

const App = () => {
    const [model, setModel] = useState(modelSample);
    const [errors, setErrors] = useState(getErrors(modelSample));

    function getErrors(model) {
        const validation = jsonSchema.validate(model, schema);
        return Util.parseJsonValidation(validation);
    }

    const onChange = (path, value) => {
        console.log(path, value);
        const newModel = { ...model };
        if (path.startsWith("selectionExcludes")) {
            SelectionExcludes.onChange(newModel, path, value)
        }
        else {
            _set(newModel, path, value);
        }
        setErrors(getErrors(newModel));
        setModel(newModel);
    }

    const onRemove = (path) => {
        const newModel = { ...model };
        Util.remove(newModel, path);
        setErrors(getErrors(newModel));
        setModel(newModel);
    }

    const onRender = (props, defaultRenderMethod) => {
        if (props.path === "name") {
            return defaultRenderMethod({ ...props, disabled: true })
        }
        if (props.path === "selectionExcludes") {
            return <SelectionExcludes {...props} defaultRenderMethod={defaultRenderMethod} />
        }
        return defaultRenderMethod(props);
    }

    return (
        <JsonSchemaForm
            schema={schema}
            model={model}
            onChange={onChange}
            onRemove={onRemove}
            onRender={onRender}
            errors={errors}
            texts={{ boolYes: "Ja", boolNo: "Nej", boolNull: "Apa" }}
        />
    );
}

ReactDOM.render(
    <div>
        <h1>Test</h1>
        <App />
    </div>,
    document.getElementById("root")
);