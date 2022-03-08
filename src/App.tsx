import { ChakraProvider, Container, Grid } from "@chakra-ui/react";
import yaml from "js-yaml";
import { keyBy, mapValues } from "lodash";
import React, { useState } from "react";
import "./App.css";
import { Header } from "./components/Header";
import { YMLEditor } from "./components/YMLEditor";
import { YMLViewer } from "./components/YMLViewer";
import { PRIMITIVES } from "./constants";
import { HathoraYmlDefinition, MethodDefinition, TypeDefinition, TypeDescription } from "./HathoraTypes";

const toStringTypeDescription = (typeDescription: TypeDescription) => {
    return typeDescription.type + (typeDescription.isArray ? "[]" : "") + (typeDescription.isOptional ? "?" : "");
};

const toString = (definition: TypeDefinition) => {
    if (definition.type === "Alias") {
        return toStringTypeDescription(definition.typeDescription);
    }
    if (definition.type === "Enum") {
        return definition.enums;
    }
    if (definition.type === "Union") {
        return definition.unions;
    }
    if (definition.type === "Object") {
        return mapValues(definition.fields, value => toStringTypeDescription(value));
    }
};

const toStringMethod = (method: MethodDefinition) => {
    return mapValues(method.fields, parameter => toStringTypeDescription(parameter));
};

function App() {
    const [types, setTypes] = useState<TypeDefinition[]>([
        {
            name: "MyAlias",
            type: "Alias",
            typeDescription: {
                isArray: true,
                type: PRIMITIVES.STRING,
            },
        },
        {
            name: "UserState",
            type: "Object",
            fields: {
                "id": {
                    type: "string", isArray: true, isOptional: true,
                },
            },
        },
        {
            name: "MyEnum",
            type: "Enum",
            enums: ["VAL_1", "VAL_2"],
        },
        {
            name: "MyUnion",
            type: "Union",
            unions: ["UserState", "MyEnum"],
        },
    ]);

    const [methods, setMethods] = useState<MethodDefinition[]>([
        {
            name: "createTest",
            fields: {
                "first": {
                    type: "string", isArray: false, isOptional: false,
                },
            },
        },
        {
            name: "disableTest",
            fields: {
                "state": {
                    type: "UserState", isArray: false, isOptional: false,
                },
            },
        },
    ]);

    const [userState, setUserState] = useState<string>("string");
    const [error, setError] = useState<string>("string");

    const config: HathoraYmlDefinition = {
        types: keyBy(types, "name"),
        methods: keyBy(methods, "name"),
        userState: userState,
        error: error,
    };

    const stringifiedConfig = {
        ...config,
        types: mapValues(config.types, type => toString(type)),
        methods: mapValues(config.methods, method => toStringMethod(method)),
    };

    return (
        <ChakraProvider>
            <Container maxWidth='container.xl' mb='5'>
                <Header />
                <Grid templateColumns='repeat(2, 1fr)' gap='20'>
                    <YMLEditor
                        types={types}
                        setTypes={setTypes}
                        methods={methods}
                        setMethods={setMethods}
                        userState={userState}
                        setUserState={setUserState}
                        errorType={error}
                        setErrorType={setError}
                    />
                    <YMLViewer content={yaml.dump(stringifiedConfig)}/>
                </Grid>
            </Container>
        </ChakraProvider>
    );
}

export default App;
