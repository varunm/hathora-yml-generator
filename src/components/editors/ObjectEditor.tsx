import {
    Editable,
    EditableInput,
    EditablePreview,
    Flex,
    IconButton,
    Select,
    Stack,
    Tooltip,
} from "@chakra-ui/react";
import { map, set } from "lodash";
import React from "react";
import { RiQuestionMark } from "react-icons/ri";
import { VscSymbolArray } from "react-icons/vsc";
import { PRIMITIVES } from "../../constants";
import { ObjectType, TypeDefinition } from "../../HathoraTypes";
import { TypeNameHeader } from "../TypeNameHeader";

interface IObjectEditorProps {
    definition: ObjectType;
    updateDefinition: (definition: TypeDefinition) => void;
    deleteType: () => void;
}

export function ObjectEditor({
    definition, updateDefinition, deleteType,
}: IObjectEditorProps) {
    const onFieldNameUpdated = (fieldName: string) => (nextValue: string) => {
        if (nextValue === fieldName) {
            return;
        }

        const newDefinition: ObjectType = {
            ...definition,
            fields: {
                ...definition.fields,
            },
        };

        newDefinition.fields[nextValue] = newDefinition.fields[fieldName];
        delete newDefinition.fields[fieldName];

        updateDefinition(newDefinition);
    };

    const onSelect = (fieldName: string) => (event: React.ChangeEvent<HTMLSelectElement>) => {
        const newDefinition: ObjectType = {
            ...definition,
            fields: {
                ...definition.fields,
            },
        };
        set(newDefinition, ["fields", fieldName, "type"], event.target.value as PRIMITIVES);
        updateDefinition(newDefinition);
    };

    const isArrayToggled = (fieldName: string) => () => {
        const newDefinition: ObjectType = {
            ...definition,
            fields: {
                ...definition.fields,
            },
        };
        set(newDefinition, ["fields", fieldName, "isArray"], !newDefinition.fields[fieldName].isArray);
        updateDefinition(newDefinition);
    };

    const isOptionalToggled = (fieldName: string) => () => {
        const newDefinition: ObjectType = {
            ...definition,
            fields: {
                ...definition.fields,
            },
        };
        set(newDefinition, ["fields", fieldName, "isOptional"], !newDefinition.fields[fieldName].isOptional);
        updateDefinition(newDefinition);
    };

    return (
        <Flex direction='column'>
            <Flex direction='row'>
                <TypeNameHeader definition={definition} updateDefinition={updateDefinition} deleteType={deleteType} />
            </Flex>
            <Stack ml='2' spacing={[1, 1]} direction={["row", "column"]}>
                {map(definition.fields, (field, name) => {
                    return (
                        <Flex direction='row' key={name}>
                            <Editable
                                defaultValue={name}
                                onSubmit={onFieldNameUpdated(name)}
                            >
                                <EditablePreview />
                                <EditableInput />
                            </Editable>
                            <Select size='sm' placeholder='Select option' onChange={onSelect(name)} value={field.type}>
                                {map(Object.values(PRIMITIVES), value => <option key={value} value={value}>{value}</option>)}
                            </Select>
                            <Stack ml='2' spacing={[2, 2]} direction={["column", "row"]}>
                                <Tooltip label="Convert to array" placement="top" openDelay={200}>
                                    <IconButton
                                        size='sm'
                                        variant={field.isArray ? "solid" : "outline"}
                                        colorScheme='teal'
                                        aria-label='isArray'
                                        fontSize='20px'
                                        onClick={isArrayToggled(name)}
                                        icon={<VscSymbolArray />}
                                    />
                                </Tooltip>
                                <Tooltip label="Convert to optional" placement="top" openDelay={200}>
                                    <IconButton
                                        size='sm'
                                        variant={field.isOptional ? "solid" : "outline"}
                                        colorScheme='teal'
                                        aria-label='isOptional'
                                        fontSize='20px'
                                        onClick={isOptionalToggled(name)}
                                        icon={<RiQuestionMark />}
                                    />
                                </Tooltip>
                            </Stack>
                        </Flex>);
                })}
            </Stack>
        </Flex>
    );
}
