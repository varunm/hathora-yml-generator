import {
    Checkbox,
    CheckboxGroup,
    CloseButton,
    Editable,
    EditableInput,
    EditablePreview,
    Flex,
    FormControl,
    Heading,
    Select,
    Stack,
} from "@chakra-ui/react";
import { isEmpty, StringOrNumber } from "@chakra-ui/utils";
import yaml from "js-yaml";
import {
    filter,
    keyBy,
    map,
    mapValues,
    set,
} from "lodash";
import React, { useState } from "react";
import { PRIMITIVES } from "../constants";
import { TypeDefinition, TypeDescription } from "../HathoraTypes";
import { AddNewType } from "./AddNewType";
import { AliasEditor } from "./editors/AliasEditor";
import { EnumEditor } from "./editors/EnumEditor";
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
    const [isEditing, setIsEditing] = useState<boolean>(false);
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

    const onSelect = (index: number, fieldName?: string) => (event: React.ChangeEvent<HTMLSelectElement>) => {
        const updatedTypes = [...types];
        const definition = types[index];

        if (definition.type === "Alias") {
            set(definition, "typeDescription.type", event.target.value as PRIMITIVES);
            updatedTypes[index] = definition;
        }

        if ((definition.type === "Object") && (fieldName != undefined)) {
            set(definition, ["fields", fieldName, "type"], event.target.value as PRIMITIVES);
            updatedTypes[index] = definition;
        }
        setTypes(updatedTypes);
    };

    const onFieldNameUpdated = (index: number, fieldName: string) => (nextValue: string) => {
        const updatedTypes = [...types];
        const definition = types[index];

        if (definition.type === "Object") {
            definition.fields[nextValue] = definition.fields[fieldName];
            delete definition.fields[fieldName];
            updatedTypes[index] = definition;
        }
        setTypes(updatedTypes);
    };

    const onNameUpdated = (index: number) => (nextValue: string) => {
        const updatedTypes = [...types];
        const definition = types[index];

        updatedTypes[index] = {
            ...definition,
            name: nextValue,
        };
        setTypes(updatedTypes);
        setIsEditing(false);
    };

    const onCheckboxClicked = (index: number, fieldName?: string) => (values: StringOrNumber[]) => {
        const updatedTypes = [...types];
        const definition = types[index];

        if (definition.type === "Alias") {
            updatedTypes[index] = {
                ...definition,
                typeDescription: {
                    type: definition.typeDescription.type,
                    isArray: values.includes("array"),
                    isOptional: values.includes("optional"),
                },
            };
        }

        if ((definition.type === "Object") && (fieldName != undefined)) {
            set(definition, ["fields", fieldName, "isArray"], values.includes("array"));
            set(definition, ["fields", fieldName, "isOptional"], values.includes("optional"));
            updatedTypes[index] = definition;
        }
        setTypes(updatedTypes);
    };

    const onTypeTagDelete = (index: number, typeLabel: string) => (_event: React.MouseEvent<HTMLButtonElement>) => {
        const updatedTypes = [...types];
        const definition = types[index];

        if (definition.type === "Enum") {
            updatedTypes[index] = {
                ...definition,
                enums: filter(definition.enums, label => label !== typeLabel),
            };
        }

        if (definition.type === "Union") {
            updatedTypes[index] = {
                ...definition,
                unions: filter(definition.unions, label => label !== typeLabel),
            };
        }

        setTypes(updatedTypes);
    };

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
                <FormControl key={definition.name} mb='2'>
                    <Flex direction='column'>
                        <Flex direction='row'>
                            {/* <TypeName name={definition.name} onSubmit={onNameUpdated(index)} /> */}
                            <CloseButton onClick={deleteType(index)}/>
                        </Flex>
                        <Stack ml='2' spacing={[1, 1]} direction={["row", "column"]}>
                            {map(definition.fields, (field, name) => {
                                return (
                                    <Flex direction='row' key={name}>
                                        <Editable
                                            defaultValue={name}
                                            onSubmit={onFieldNameUpdated(index, name)}
                                        >
                                            <EditablePreview />
                                            <EditableInput />
                                        </Editable>
                                        <Select placeholder='Select option' onChange={onSelect(index, name )} value={field.type}>
                                            {map(Object.values(PRIMITIVES), value => <option key={value} value={value}>{value}</option>)}
                                        </Select>
                                        <CheckboxGroup
                                            colorScheme='green'
                                            onChange={onCheckboxClicked(index, name)}
                                            value={[
                                                field.isArray ? "array": "", field.isOptional ? "optional" : "",
                                            ].filter(val => !isEmpty(val))}
                                        >
                                            <Stack ml='2' spacing={[1, 5]} direction={["column", "row"]}>
                                                <Checkbox value="array">Array</Checkbox>
                                                <Checkbox value="optional">Optional</Checkbox>
                                            </Stack>
                                        </CheckboxGroup>
                                    </Flex>);
                            })}
                        </Stack>
                    </Flex>
                </FormControl>
            );
        }
    };

    return (
        <Flex justifyContent='space-around'>
            <Flex direction='column' width='50%'>
                <Heading size='md'>Types</Heading>
                {map(types, renderType)}
                <AddNewType addNewType={addNewType} />
            </Flex>
            <YMLViewer content={yaml.dump(stringifiedConfig)}/>
        </Flex>);
}
