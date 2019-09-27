import React, { useState } from "react";
import ReactDOM from "react-dom";
import "bootstrap/dist/css/bootstrap.css";
import schema from "./schemaSample";
import modelSample from "./modelSample";
import _set from "lodash.set";
import jsonSchema from "jsonschema";
import JsonSchemaForm, { Util } from "../src/index.js";

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
        if (path.startsWith("selectionExcludes")) {
            console.log(path.split(".")[1], value);
            return;
        }

        console.log("onchange", path, value);

        const newModel = { ...model };
        _set(newModel, path, value);
        setErrors(getErrors(newModel));
        setModel(newModel);
    }

    const onRemove = (path) => {
        const newModel = { ...model };
        Util.remove(newModel, path);
        setErrors(getErrors(newModel));
        setModel(newModel);
    }

    const onRender = {
        "name": function a(props, defaultRenderMethod) {
            return defaultRenderMethod({ ...props, disabled: true })
        },
        "selectionExcludes": function selectionExcludes(props, defaultRenderMethod) {
            console.log(props);
            const value = {};
            const schemaNode = {
                type: "object",
                properties: {}
            };
            props.schemaNode.items.oneOf.forEach(oneOf => {
                value[oneOf.const] = true;
                schemaNode.properties[oneOf.const] = {
                    type: "boolean",
                    title: oneOf.title
                }
            });
            return defaultRenderMethod({ ...props, value, schemaNode });
        }
    };

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