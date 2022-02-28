import {
    CloseButton,
    Editable,
    EditableInput,
    EditablePreview,
    Flex,
    FormControl,
    FormErrorMessage,
    Stack,
    Tag,
    TagCloseButton,
    TagLabel,
} from "@chakra-ui/react";
import { filter, isEmpty, map } from "lodash";
import React, { useState } from "react";
import { UnionType, TypeDefinition } from "../../HathoraTypes";
import { TypeName } from "../TypeName";

interface IUnionEditorProps {
    definition: UnionType;
    updateDefinition: (definition: TypeDefinition) => void;
    deleteType: () => void;
}

export function UnionEditor({
    definition, updateDefinition, deleteType,
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

    return (
        <Flex direction='column'>
            <Flex direction='row'>
                <TypeName definition={definition} updateDefinition={updateDefinition} />
                <CloseButton onClick={deleteType}/>
            </Flex>
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
            <Stack ml='2' spacing={[1, 1]} direction={["row", "column"]}>
                {map(definition.unions.sort(), unionLabel =>
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
            </Stack>
        </Flex>
    );
}
