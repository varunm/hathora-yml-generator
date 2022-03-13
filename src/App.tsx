import { ChakraProvider, Container, Grid } from "@chakra-ui/react";
import { cloneDeep, keyBy } from "lodash";
import React, { useState } from "react";
import "./App.css";
import { Header } from "./components/Header";
import { YMLEditor } from "./components/YMLEditor";
import { YMLViewer } from "./components/YMLViewer";
import { Auth, HathoraYmlDefinition, MethodDefinition, TypeDefinition } from "./HathoraTypes";

const TYPES: TypeDefinition[] = [
    {
        name: "MyAlias",
        type: "Alias",
        typeDescription: {
            isArray: true,
            type: "asd",
        },
    },
    {
        name: "UserState",
        type: "Object",
        fields: {
            "id": {
                type: "stringg", isArray: true, isOptional: true,
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
        unions: ["UserState", "MyEnumm", "testtest"],
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
        name: "DisableTest",
        fields: {
            "state": {
                type: "userStatee", isArray: false, isOptional: false,
            },
        },
    },
];

const USER_STATE = "";
const ERROR = "stringg";
const TICK: number | undefined = 30;
const AUTH: Auth = {};

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
