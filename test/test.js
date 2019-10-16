import React from "react";
import ReactDOM from "react-dom";
import "bootstrap/dist/css/bootstrap.css";
import _set from "lodash.set";
import jsonSchema from "jsonschema";
import JsonSchemaForm, { Util } from "../src/index.js";

const instanceSample = {
    name: "Lala"
};

const schema = {
    type: "object",
    properties: {
        name: {
            type: "string"
        }
    }
};

for (let i = 0; i < 2; ++i) {
    const name = "val" + i;
    schema.properties[name] = {
        type: "boolean"
    }
    instanceSample[name] = true;
}

class App extends React.Component {

    constructor() {
        super();
        this.state = {
            instance: instanceSample,
            errors: {}
        };
        this.setInstance = this.setInstance.bind(this);
        this.onChange = this.onChange.bind(this);
        this.onRemove = this.onRemove.bind(this);
        this.onRender = this.onRender.bind(this);
    }

    setInstance(newInstance) {
        const validation = jsonSchema.validate(newInstance, schema);
        this.setState({
            instance: newInstance,
            errors: Util.parseJsonValidation(validation)
        });
    }

    onChange(path, value) {
        const newInstance = { ...this.state.instance };
        _set(newInstance, path, value);
        this.setInstance(newInstance);
    }

    onRemove(path) {
        const newInstance = { ...this.state.instance };
        Util.remove(newInstance, path);
        this.setInstance(newInstance);
    }

    onRender(props, defaultRenderMethod) {
        if (props.path === "name") {
            return defaultRenderMethod({ ...props, disabled: true })
        }
        return defaultRenderMethod(props);
    }

    render() {
        return (
            <JsonSchemaForm
                schema={schema}
                instance={this.state.instance}
                errors={this.state.errors}
                onChange={this.onChange}
                onRemove={this.onRemove}
                onRender={this.onRender}
                texts={{ boolYes: "Yar", boolNo: "Nay", boolNull: "Doom" }}
            />
        );
    }
}


ReactDOM.render(
    <div>
        <h1>Test</h1>
        <App />
    </div>,
    document.getElementById("root")
);