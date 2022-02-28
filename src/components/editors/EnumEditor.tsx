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
import { EnumType, TypeDefinition } from "../../HathoraTypes";
import { TypeName } from "../TypeName";

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
        <Flex direction='column'>
            <Flex direction='row'>
                <TypeName definition={definition} updateDefinition={updateDefinition} />
                <CloseButton onClick={deleteType}/>
            </Flex>
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
                        <TagCloseButton onClick={onEnumDeleted(enumLabel)} />
                    </Tag>
                )}
            </Stack>
        </Flex>
    );
}
