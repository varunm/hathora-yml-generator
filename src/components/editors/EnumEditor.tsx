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
import { EnumType, TypeDefinition } from "../../HathoraTypes";
import { TypeNameHeader } from "../TypeNameHeader";

interface IEnumEditorProps {
    definition: EnumType;
    updateDefinition: (definition: TypeDefinition) => void;
    deleteType: () => void;
}

export function EnumEditor({
    definition, updateDefinition, deleteType,
}: IEnumEditorProps) {
    const [errorMessage, setErrorMessage] = useState("");

    const onNewEnumAdded = (nextValue: string) => {
        if (definition.enums.includes(nextValue)) {
            setErrorMessage("Value must be unique");
            return;
        }

        if (isEmpty(nextValue)) {
            setErrorMessage("Value must be not be empty");
            return;
        }

        const newEnums = [...definition.enums];
        newEnums.push(nextValue);
        updateDefinition({
            ...definition,
            enums: newEnums,
        });
        setErrorMessage("");
    };

    const onEnumDeleted = (enumLabel: string) => () => {
        updateDefinition({
            ...definition,
            enums: filter(definition.enums, label => label !== enumLabel),
        });
    };

    return (
        <VStack align='flex-start' direction='column'>
            <TypeNameHeader definition={definition} updateDefinition={updateDefinition} deleteType={deleteType} />
            <FormControl isInvalid={!isEmpty(errorMessage)}>
                <Editable
                    placeholder="Add new Enum value"
                    submitOnBlur={false}
                    onSubmit={onNewEnumAdded}
                >
                    <EditablePreview />
                    <EditableInput />
                </Editable>
                <FormErrorMessage>{errorMessage}</FormErrorMessage>
            </FormControl>
            <Wrap>
                {map(definition.enums.sort(), enumLabel =>
                    <Tag
                        size='md'
                        key={enumLabel}
                        borderRadius='full'
                        variant='solid'
                        colorScheme='green'
                    >
                        <TagLabel>{enumLabel}</TagLabel>
                        <TagCloseButton onClick={onEnumDeleted(enumLabel)} />
                    </Tag>
                )}
            </Wrap>
        </VStack>
    );
}
