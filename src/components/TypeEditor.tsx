import { Heading, HStack, VStack } from "@chakra-ui/react";
import yaml from "js-yaml";
import { keyBy, map, mapValues } from "lodash";
import React, { useState } from "react";
import { PRIMITIVES } from "../constants";
import { TypeDefinition, TypeDescription } from "../HathoraTypes";
import { AddNewType } from "./AddNewType";
import { AliasEditor } from "./editors/AliasEditor";
import { EnumEditor } from "./editors/EnumEditor";
import { ObjectEditor } from "./editors/ObjectEditor";
import { UnionEditor } from "./editors/UnionEditor";
import { YMLViewer } from "./YMLViewer";

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

interface MethodDefinition {
    name: string;
    parameters: TypeDescription[];
}

interface HathoraYmlDefinition {
    types: {[name: string]: TypeDefinition};
    methods: MethodDefinition[];
    userState: string;
    initialize: string;
    error: string;
}

export function TypeEditor() {
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
            unions: ["UserState", "AnotherState"],
        },
    ]);
    const [config, setConfig] = useState<HathoraYmlDefinition>({
        types: {},
        methods: [],
        userState: "UserState",
        initialize: "initMethod",
        error: "string",
    });

    const updatedConfig = {
        ...config,
        types: keyBy(types, "name"),
    };

    const stringifiedConfig = {
        ...updatedConfig,
        types: mapValues(updatedConfig.types, type => toString(type)),
    };

    const sortedKeysTypes = Object.keys(config.types);
    sortedKeysTypes.sort();

    const deleteType = (index: number) => () => {
        const updatedTypes = [...types];
        updatedTypes.splice(index, 1);
        setTypes(updatedTypes);
    };

    const updateDefinition = (index: number) => (definition: TypeDefinition) => {
        const updatedTypes = [...types];
        updatedTypes[index] = definition;
        setTypes(updatedTypes);
    };

    const addNewType = (newType: TypeDefinition) => {
        const updatedTypes = [...types];
        updatedTypes.push(newType);
        setTypes(updatedTypes);
    };

    const renderType = (definition: TypeDefinition, index: number) => {
        if (definition.type === "Alias") {
            return (
                <AliasEditor key={definition.name} definition={definition} updateDefinition={updateDefinition(index)} deleteType={deleteType(index)}/>
            );
        }
        if (definition.type === "Enum") {
            return (
                <EnumEditor key={definition.name} definition={definition} updateDefinition={updateDefinition(index)} deleteType={deleteType(index)}/>
            );
        }
        if (definition.type === "Union") {
            return (
                <UnionEditor key={definition.name} definition={definition} updateDefinition={updateDefinition(index)} deleteType={deleteType(index)}/>
            );
        }
        if (definition.type === "Object") {
            return (
                <ObjectEditor key={definition.name} definition={definition} updateDefinition={updateDefinition(index)} deleteType={deleteType(index)}/>
            );
        }
    };

    return (
        <HStack align='flex-start' justifyContent='space-around'>
            <VStack align='flex-start' width='50%'>
                <Heading size='md'>Types</Heading>
                {map(types, renderType)}
                <AddNewType addNewType={addNewType} />
            </VStack>
            <YMLViewer content={yaml.dump(stringifiedConfig)}/>
        </HStack>);
}
