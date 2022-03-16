import { ChakraProvider, Container, Grid } from "@chakra-ui/react";
import { cloneDeep, get, keyBy, mapValues } from "lodash";
import React, { useEffect, useState } from "react";
import "./App.css";
import { Header } from "./components/Header";
import { YMLEditor } from "./components/YMLEditor";
import { YMLViewer } from "./components/YMLViewer";
import { Auth, HathoraYmlDefinition, MethodDefinition, TypeDefinition } from "./HathoraTypes";
import yaml from "js-yaml";

const TYPES: TypeDefinition[] = [
    {
        name: "MyAlias",
        type: "Alias",
        typeDescription: {
            isArray: true,
            type: "boolean",
        },
    },
    {
        name: "UserState",
        type: "Object",
        fields: {
            "ids": {
                type: "string", isArray: true, isOptional: false,
            },
        },
    },
    {
        name: "AnotherObject",
        type: "Object",
        fields: {
            "isReady": {
                type: "MyAlias", isArray: false, isOptional: true,
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
        unions: ["MyAlias", "int", "string"],
    },
];

const METHODS: MethodDefinition[] = [
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
];

const USER_STATE = "UserState";
const ERROR = "string";
const TICK: number | undefined = 50;
const AUTH: Auth = {
    "anonymous": {
        "separator": "",
    },
};

// const typeDescriptionFromString = (type: TypeDefinition): TypeDescription => {
//     if ()
//     return {
//         type: description.replace("[]", "").replace("?", ""),
//         isArray: description.includes("[]"),
//         isOptional: description.includes("?"),
//     };
// };

function App() {
    const [config, setConfig] = useState<HathoraYmlDefinition>({
        types: keyBy(TYPES, "name"),
        methods: keyBy(METHODS, "name"),
        userState: USER_STATE,
        error: ERROR,
        tick: TICK,
        auth: AUTH,
    });

    const [cleanConfig, setCleanConfig] = useState<HathoraYmlDefinition>({
        ...cloneDeep(config),
    });

    const updateConfigs = (newConfig: HathoraYmlDefinition) => {
        const parsed = HathoraYmlDefinition.safeParse(newConfig);
        if (parsed.success) {
            setCleanConfig(newConfig);
        }
        setConfig(newConfig);
    };

    useEffect(() => {
        fetch("http://localhost:5000/load")
            .then(response => response.text())
            .then(data => {
                const loadedConfig = yaml.load(data);
                // console.log(loadedConfig);
                const loadedTypes = get(loadedConfig, "types");
                console.log(loadedTypes);
                const types = mapValues(loadedTypes, typeDescriptionFromString);
                console.log(types);
                // setConfig({
                //     types: mapValues(get(loadedConfig, "types"), typeDescriptionFromString),
                // });
            });
    }, []);

    return (
        <ChakraProvider>
            <Container maxWidth='container.xl' mb='5'>
                <Header />
                <Grid templateColumns='repeat(2, 1fr)' gap='20'>
                    <YMLEditor
                        config={config}
                        setConfig={updateConfigs}
                    />
                    <YMLViewer config={cleanConfig} />
                </Grid>
            </Container>
        </ChakraProvider>
    );
}

export default App;
