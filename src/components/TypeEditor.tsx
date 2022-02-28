import {
    Checkbox,
    CheckboxGroup,
    Editable,
    EditableInput,
    EditablePreview,
    Flex,
    FormControl,
    Heading,
    Select,
    Stack,
    Tag,
    TagCloseButton,
    TagLabel,
} from "@chakra-ui/react";
import { StringOrNumber } from "@chakra-ui/utils";
import yaml from "js-yaml";
import { filter, keyBy, map, mapValues } from "lodash";
import React, { useState } from "react";
import { z } from "zod";
import { PRIMITIVES } from "../constants";
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
    const [editingText, setEditingText] = useState<string>("");
    const [types, setTypes] = useState<TypeDefinition[]>([
        {
            name: "MyAlias",
            type: "Alias",
            typeDescription: {
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
            name: "MyUnion",
            type: "Union",
            unions: ["UserState", "AnotherState"],
        },
        {
            name: "MyEnum",
            type: "Enum",
            enums: ["VAL_1", "VAL_2"],
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

    const onSelect = (index: number) => (event: React.ChangeEvent<HTMLSelectElement>) => {
        const updatedTypes = [...types];
        const definition = types[index];

        if (definition.type === "Alias") {
            updatedTypes[index] = {
                ...definition,
                typeDescription: {
                    type: event.target.value as PRIMITIVES,
                },
            };
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

    const onNameChange = (nextValue: string) => {
        setEditingText(nextValue);
    };

    const onEdit = (initialName: string) => () => {
        if (!isEditing) {
            setEditingText(initialName);
            setIsEditing(true);
        }
    };

    const onCheckboxClicked = (index: number) => (values: StringOrNumber[]) => {
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
        setTypes(updatedTypes);
    };

    const onEnumTagDelete = (index: number, enumLabel: string) => (_event: React.MouseEvent<HTMLButtonElement>) => {
        const updatedTypes = [...types];
        const definition = types[index];

        if (definition.type === "Enum") {
            updatedTypes[index] = {
                ...definition,
                enums: filter(definition.enums, label => label !== enumLabel),
            };
        }
        setTypes(updatedTypes);
    };

    const onNewEnumAdded = (index: number) => (nextValue: string) => {
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
        setTypes(updatedTypes);
    };

    const renderType = (definition: TypeDefinition, index: number) => {
        if (definition.type === "Alias") {
            return (
                <FormControl key={index} mb='2'>
                    <Flex direction='row'>
                        <Editable
                            defaultValue={definition.name}
                            // value={isEditing ? editingText : definition.name}
                            // onEdit={onEdit(definition.name)}
                            // onChange={onNameChange}
                            onSubmit={onNameUpdated(index)}
                        >
                            <EditablePreview />
                            <EditableInput />
                        </Editable>
                        <Select placeholder='Select option' onChange={onSelect(index)} value={definition.typeDescription.type}>
                            {map(Object.values(PRIMITIVES), value => <option key={value} value={value}>{value}</option>)}
                        </Select>
                        <CheckboxGroup colorScheme='green' onChange={onCheckboxClicked(index)}>
                            <Stack ml='2' spacing={[1, 5]} direction={["column", "row"]}>
                                <Checkbox value="array" checked={definition.typeDescription.isArray}>Array</Checkbox>
                                <Checkbox value="optional" checked={definition.typeDescription.isOptional}>Optional</Checkbox>
                            </Stack>
                        </CheckboxGroup>
                    </Flex>
                </FormControl>
            );
        }
        if (definition.type === "Enum") {
            return (
                <FormControl key={index} mb='2'>
                    <Flex direction='column'>
                        <Editable
                            defaultValue={definition.name}
                            // onEdit={onEdit(definition.name)}
                            // onChange={onNameChange}
                            onSubmit={onNameUpdated(index)}
                        >
                            <EditablePreview />
                            <EditableInput />
                        </Editable>
                        <Editable
                            placeholder="Add new Enum value"
                            submitOnBlur={false}
                            onSubmit={onNewEnumAdded(index)}
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
                                    <TagCloseButton onClick={onEnumTagDelete(index, enumLabel)} />
                                </Tag>
                            )}
                        </Stack>
                    </Flex>
                </FormControl>
            );
        }
        if (definition.type === "Union") {
            return (
                <div key={index}>union</div>
            );
        }
        if (definition.type === "Object") {
            return (
                <div key={index}>object</div>
            );
        }
    };

    return (
        <Flex justifyContent='space-around'>
            <Flex direction='column' width='50%'>
                <Heading size='md'>Types</Heading>
                {map(types, renderType)}
            </Flex>
            <YMLViewer content={yaml.dump(stringifiedConfig)}/>
        </Flex>);
}
