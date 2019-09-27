import React, { useState } from "react";
import ReactDOM from "react-dom";
import JsonSchemaForm from "../src/index.js";
import "bootstrap/dist/css/bootstrap.css";
import schema from "./schemaSample";
import modelSample from "./modelSample";
import _set from "lodash.set";
import jsonSchema from "jsonschema";
import Util from "../src/Util";

console.log("test.js")

const App = () => {
    const [model, setModel] = useState(modelSample);
    const [errors, setErrors] = useState(getErrors(modelSample));

    function getErrors(model) {
        const validation = jsonSchema.validate(model, schema);
        return Util.parseJsonValidation(validation);
    }

    const onChange = (path, value) => {
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
        // "name": function a(props, defaultRenderMethod) {
        //     return <div>
        //         adasd
        //         {defaultRenderMethod(props)}
        //     </div>
        // }
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