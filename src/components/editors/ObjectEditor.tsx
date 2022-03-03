import {
    Editable,
    EditableInput,
    EditablePreview,
    FormControl,
    FormErrorMessage,
    HStack,
    VStack,
} from "@chakra-ui/react";
import { isEmpty, map, set } from "lodash";
import React, { useState } from "react";
import { PRIMITIVES } from "../../constants";
import { ObjectType, TypeDefinition, TypeDescription } from "../../HathoraTypes";
import { AddIconButton } from "../iconButtons/AddIconButton";
import { ArrayIconButton } from "../iconButtons/ArrayIconButton";
import { DeleteIconButton } from "../iconButtons/DeleteIconButton";
import { OptionalIconButton } from "../iconButtons/OptionalIconButton";
import { TypeNameHeader } from "../TypeNameHeader";
import { TypeSelector } from "../TypeSelector";

interface IObjectEditorProps {
    definition: ObjectType;
    updateDefinition: (definition: TypeDefinition) => void;
    deleteType: () => void;
    availableTypes: string[];
}

export function ObjectEditor({
    definition, updateDefinition, deleteType, availableTypes,
}: IObjectEditorProps) {
    const [errorMessages, setErrorMessages] = useState<{[key: string]: string}>({});

    const onFieldNameUpdated = (fieldName: string) => (nextValue: string) => {
        if (nextValue === fieldName) {
            return;
        }

        if (Object.keys(definition.fields).includes(nextValue)) {
            setErrorMessages({
                ...errorMessages,
                [fieldName]: "Field already exists with this name",
            });
            return;
        }

        const parsed = TypeDescription.shape.type.safeParse(nextValue);
        if (!parsed.success) {
            setErrorMessages({
                ...errorMessages,
                [fieldName]: parsed.error.issues[0].message,
            });
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
        const newErrorMessages = {
            ...errorMessages,
        };
        delete newErrorMessages[fieldName];
        setErrorMessages(newErrorMessages);
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

    const deleteField = (fieldName: string) => () => {
        const newFields: {[name: string]: TypeDescription} = {
            ...definition.fields,
        };
        delete newFields[fieldName];
        updateDefinition({
            ...definition,
            fields: newFields,
        });
    };

    const addField = () => {
        const newFields: {[name: string]: TypeDescription} = {
            ...definition.fields,
            "newProperty": {
                type: "string",
            },
        };

        updateDefinition({
            ...definition,
            fields: newFields,
        });
    };

    return (
        <VStack align='flex-start' key={definition.name} backgroundColor='gray.100' width='100%' padding='2'>
            <HStack>
                <TypeNameHeader definition={definition} updateDefinition={updateDefinition} deleteType={deleteType} />
                <AddIconButton onClick={addField} />
            </HStack>
            <VStack paddingLeft='5'>
                {map(definition.fields, (field, name) =>
                    <FormControl key={name} isInvalid={!isEmpty(errorMessages[name])}>
                        <HStack>
                            <Editable
                                defaultValue={name}
                                onSubmit={onFieldNameUpdated(name)}
                            >
                                <EditablePreview />
                                <EditableInput />
                            </Editable>
                            <TypeSelector onChange={onSelect(name)} selectedValue={field.type} availableTypes={availableTypes}/>
                            <ArrayIconButton isSelected={field.isArray} onClick={isArrayToggled(name)} />
                            <OptionalIconButton isSelected={field.isOptional} onClick={isOptionalToggled(name)} />
                            <DeleteIconButton onClick={deleteField(name)} />
                        </HStack>
                        <FormErrorMessage>{errorMessages[name]}</FormErrorMessage>
                    </FormControl>
                )}
            </VStack>
        </VStack>
    );
}
