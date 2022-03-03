import {
    Editable,
    EditableInput,
    EditablePreview,
    FormControl,
    FormErrorMessage,
    HStack,
    Tag,
    TagCloseButton,
    TagLabel,
    VStack,
    Wrap,
} from "@chakra-ui/react";
import { filter, isEmpty, map } from "lodash";
import React, { useState } from "react";
import { EnumType, EnumValueType, TypeDefinition } from "../../HathoraTypes";
import { AddIconButton } from "../iconButtons/AddIconButton";
import { TypeNameHeader } from "../TypeNameHeader";

interface IEnumEditorProps {
    definition: EnumType;
    updateDefinition: (definition: TypeDefinition) => void;
    deleteType: () => void;
}

export function EnumEditor({
    definition, updateDefinition, deleteType,
}: IEnumEditorProps) {
    const [addMode, setAddMode] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const onNewEnumAdded = (nextValue: string) => {
        if (definition.enums.includes(nextValue)) {
            setErrorMessage("Value must be unique");
            return;
        }

        const parsed = EnumValueType.safeParse(nextValue);
        if (!parsed.success) {
            setErrorMessage(parsed.error.issues[0].message);
            return;
        }

        const newEnums = [...definition.enums];
        newEnums.push(nextValue);
        updateDefinition({
            ...definition,
            enums: newEnums,
        });
        setErrorMessage("");
        setAddMode(false);
    };

    const onEnumDeleted = (enumLabel: string) => () => {
        updateDefinition({
            ...definition,
            enums: filter(definition.enums, label => label !== enumLabel),
        });
    };

    const addEnum = () => {
        setAddMode(true);
    };

    return (
        <VStack align='flex-start' key={definition.name} backgroundColor='gray.100' width='100%' padding='2'>
            <HStack>
                <TypeNameHeader definition={definition} updateDefinition={updateDefinition} deleteType={deleteType} />
                <AddIconButton onClick={addEnum} />
            </HStack>
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
            <FormControl hidden={!addMode} isInvalid={!isEmpty(errorMessage)}>
                <Editable
                    placeholder="Add new Enum value"
                    submitOnBlur={true}
                    onSubmit={onNewEnumAdded}
                    startWithEditView={true}
                >
                    <EditablePreview />
                    <EditableInput />
                </Editable>
                <FormErrorMessage>{errorMessage}</FormErrorMessage>
            </FormControl>
        </VStack>
    );
}
