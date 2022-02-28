import { AddIcon } from "@chakra-ui/icons";
import {
    Box,
    Button,
    Checkbox,
    CheckboxGroup,
    CloseButton,
    Editable,
    EditableInput,
    EditablePreview,
    Flex,
    FormControl,
    Heading,
    Input,
    Select,
    Stack,
    Tag,
    TagCloseButton,
    TagLabel,
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
import { z } from "zod";
import { PRIMITIVES } from "../constants";
import { TypeName } from "./TypeName";
import { YMLViewer } from "./YMLViewer";

const TypeDescription = z.object({
    type: z.string(),
    isArray: z.boolean().optional(),
    isOptional: z.boolean().optional(),
});

const BaseType = z.object({
    name: z.string(),
});

const AliasType = BaseType.extend({
    type: z.literal("Alias"),
    typeDescription: TypeDescription,
});

const EnumType = BaseType.extend({
    type: z.literal("Enum"),
    enums: z.array(z.string()),
});

const UnionType = BaseType.extend({
    type: z.literal("Union"),
    unions: z.array(z.string()),
});

const ObjectType = BaseType.extend({
    type: z.literal("Object"),
    fields: z.record(TypeDescription),
});

const TypeDefinition = z.discriminatedUnion("type", [AliasType, EnumType, UnionType, ObjectType]);
type TypeDescription = z.infer<typeof TypeDescription>;
type AliasType = z.infer<typeof AliasType>;
type EnumType = z.infer<typeof EnumType>;
type UnionType = z.infer<typeof UnionType>;
type ObjectType = z.infer<typeof ObjectType>;
type TypeDefinition = z.infer<typeof TypeDefinition>;
type TypeUnion = "Alias" | "Enum" | "Union" | "Object";

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
    const [newTypeName, setNewTypeName] = useState<string>("");
    const [newType, setNewType] = useState<string>("");
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

    const deleteType = (index: number) => (_event: React.MouseEvent<HTMLButtonElement>) => {
        const updatedTypes = [...types];
        updatedTypes.splice(index, 1);
        setTypes(updatedTypes);
    };

    const onNewEnumUnionAdded = (index: number) => (nextValue: string) => {
        if (nextValue === "") {
            return;
        }
        const updatedTypes = [...types];
        const definition = types[index];

        if ((definition.type === "Enum") && (!definition.enums.includes(nextValue))) {
            const newEnums = definition.enums;
            // TODO validate unique
            newEnums.push(nextValue);
            updatedTypes[index] = {
                ...definition,
                enums: newEnums,
            };
        }

        if ((definition.type === "Union") && (!definition.unions.includes(nextValue))) {
            const newUnions = definition.unions;
            // TODO validate unique
            newUnions.push(nextValue);
            updatedTypes[index] = {
                ...definition,
                unions: newUnions,
            };
        }
        setTypes(updatedTypes);
    };

    const onNewTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setNewType(event.target.value);
    };

    const onNewTypeNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNewTypeName(event.target.value);
    };

    const newTypeAdded = () => {
        console.log("newTypeAdded");
        console.log(newType);
        console.log(newTypeName);
        const updatedTypes = [...types];

        if (newType === "Alias") {
            updatedTypes.push({
                type: "Alias", name: newTypeName, typeDescription: {
                    type: "string",
                },
            });
        }

        if (newType === "Enum") {
            updatedTypes.push({
                type: "Enum", name: newTypeName, enums: [],
            });
        }

        if (newType === "Union") {
            updatedTypes.push({
                type: "Union", name: newTypeName, unions: [],
            });
        }

        if (newType === "Object") {
            updatedTypes.push({
                type: "Object", name: newTypeName, fields: {},
            });
        }

        setTypes(updatedTypes);
        setNewType("");
        setNewTypeName("");
    };

    const renderType = (definition: TypeDefinition, index: number) => {
        if (definition.type === "Alias") {
            return (
                <FormControl key={definition.name} mb='2'>
                    <Flex direction='row'>
                        <TypeName name={definition.name} onSubmit={onNameUpdated(index)} />
                        <Select placeholder='Select option' onChange={onSelect(index)} value={definition.typeDescription.type}>
                            {map(Object.values(PRIMITIVES), value => <option key={value} value={value}>{value}</option>)}
                        </Select>
                        <CheckboxGroup
                            colorScheme='green'
                            onChange={onCheckboxClicked(index)}
                            value={[
                                definition.typeDescription.isArray ? "array": "", definition.typeDescription.isOptional ? "optional" : "",
                            ].filter(val => !isEmpty(val))}
                        >
                            <Stack ml='2' spacing={[1, 5]} direction={["column", "row"]}>
                                <Checkbox value="array">Array</Checkbox>
                                <Checkbox value="optional">Optional</Checkbox>
                            </Stack>
                        </CheckboxGroup>
                        <CloseButton onClick={deleteType(index)}/>
                    </Flex>
                </FormControl>
            );
        }
        if (definition.type === "Enum") {
            return (
                <FormControl key={definition.name} mb='2'>
                    <Flex direction='column'>
                        <Flex direction='row'>
                            <TypeName name={definition.name} onSubmit={onNameUpdated(index)} />
                            <CloseButton onClick={deleteType(index)}/>
                        </Flex>
                        <Editable
                            placeholder="Add new Enum value"
                            submitOnBlur={false}
                            onSubmit={onNewEnumUnionAdded(index)}
                        >
                            <EditablePreview />
                            <EditableInput />
                        </Editable>
                        <Stack ml='2' spacing={[1, 1]} direction={["row", "column"]}>
                            {map(definition.enums.sort(), enumLabel =>
                                <Tag
                                    size='md'
                                    key={enumLabel}
                                    borderRadius='full'
                                    variant='solid'
                                    colorScheme='green'
                                >
                                    <TagLabel>{enumLabel}</TagLabel>
                                    <TagCloseButton onClick={onTypeTagDelete(index, enumLabel)} />
                                </Tag>
                            )}
                        </Stack>
                    </Flex>
                </FormControl>
            );
        }
        if (definition.type === "Union") {
            return (
                <FormControl key={definition.name} mb='2'>
                    <Flex direction='column'>
                        <Flex direction='row'>
                            <TypeName name={definition.name} onSubmit={onNameUpdated(index)} />
                            <CloseButton onClick={deleteType(index)}/>
                        </Flex>
                        <Editable
                            placeholder="Add new Union type"
                            submitOnBlur={false}
                            onSubmit={onNewEnumUnionAdded(index)}
                        >
                            <EditablePreview />
                            <EditableInput />
                        </Editable>
                        <Stack ml='2' spacing={[1, 1]} direction={["row", "column"]}>
                            {map(definition.unions.sort(), enumLabel =>
                                <Tag
                                    size='md'
                                    key={enumLabel}
                                    borderRadius='full'
                                    variant='solid'
                                    colorScheme='green'
                                >
                                    <TagLabel>{enumLabel}</TagLabel>
                                    <TagCloseButton onClick={onTypeTagDelete(index, enumLabel)} />
                                </Tag>
                            )}
                        </Stack>
                    </Flex>
                </FormControl>
            );
        }
        if (definition.type === "Object") {
            return (
                <FormControl key={definition.name} mb='2'>
                    <Flex direction='column'>
                        <Flex direction='row'>
                            <TypeName name={definition.name} onSubmit={onNameUpdated(index)} />
                            <CloseButton onClick={deleteType(index)}/>
                        </Flex>
                        <Stack ml='2' spacing={[1, 1]} direction={["row", "column"]}>
                            {map(definition.fields, (field, name) => {
                                return (
                                    <Flex direction='row' key={name}>
                                        <Editable
                                            value={name}
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
                            }
                            )}
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
                <Box flexDirection='column'>
                    <Heading size='sm'>Add New Type</Heading>
                    <FormControl>
                        <Input value={newTypeName} onChange={onNewTypeNameChange} placeholder="Name of new type" />
                    </FormControl>
                    <FormControl>
                        <Select value={newType} onChange={onNewTypeChange} placeholder='Select type'>
                            {map(["Alias", "Enum", "Union", "Object"], value => <option key={value} value={value}>{value}</option>)}
                        </Select>
                    </FormControl>
                    <Button onClick={newTypeAdded} rightIcon={<AddIcon />} colorScheme='teal' variant='outline'>
                        Add
                    </Button>

                </Box>
            </Flex>
            <YMLViewer content={yaml.dump(stringifiedConfig)}/>
        </Flex>);
}
