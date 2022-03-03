import {
    Editable,
    EditableInput,
    EditablePreview,
    FormControl,
    FormErrorMessage,
    Tag,
    TagCloseButton,
    TagLabel,
    VStack,
    Wrap,
} from "@chakra-ui/react";
import { filter, isEmpty, map } from "lodash";
import React, { useState } from "react";
import { UnionType, TypeDefinition } from "../../HathoraTypes";
import { TypeNameHeader } from "../TypeNameHeader";

interface IUnionEditorProps {
    definition: UnionType;
    updateDefinition: (definition: TypeDefinition) => void;
    deleteType: () => void;
    availableTypes: string[];
}

export function UnionEditor({
    definition, updateDefinition, deleteType, availableTypes,
}: IUnionEditorProps) {
    const [errorMessage, setErrorMessage] = useState("");

    const onNewUnionAdded = (nextValue: string) => {
        if (definition.unions.includes(nextValue)) {
            setErrorMessage("Value must be unique");
            return;
        }

        if (isEmpty(nextValue)) {
            setErrorMessage("Value must be not be empty");
            return;
        }

        const newUnions = [...definition.unions];
        newUnions.push(nextValue);
        updateDefinition({
            ...definition,
            unions: newUnions,
        });
        setErrorMessage("");
    };

    const onUnionDeleted = (unionLabel: string) => () => {
        updateDefinition({
            ...definition,
            unions: filter(definition.unions, label => label !== unionLabel),
        });
    };

    const unionLabels = definition.unions;
    unionLabels.sort();

    return (
        <VStack align='flex-start' key={definition.name} backgroundColor='gray.100' width='100%' padding='2'>
            <TypeNameHeader definition={definition} updateDefinition={updateDefinition} deleteType={deleteType} />
            <FormControl isInvalid={!isEmpty(errorMessage)}>
                <Editable
                    placeholder="Add new Union type"
                    submitOnBlur={false}
                    onSubmit={onNewUnionAdded}
                >
                    <EditablePreview />
                    <EditableInput />
                </Editable>
                <FormErrorMessage>{errorMessage}</FormErrorMessage>
            </FormControl>
            <Wrap>
                {map(unionLabels, unionLabel =>
                    <Tag
                        size='md'
                        key={unionLabel}
                        borderRadius='full'
                        variant='solid'
                        colorScheme='green'
                    >
                        <TagLabel>{unionLabel}</TagLabel>
                        <TagCloseButton onClick={onUnionDeleted(unionLabel)} />
                    </Tag>
                )}
            </Wrap>
        </VStack>
    );
}
