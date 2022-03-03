import { DeleteIcon } from "@chakra-ui/icons";
import {
    Badge,
    Editable,
    EditableInput,
    EditablePreview,
    FormControl,
    FormErrorMessage,
    HStack,
    IconButton,
} from "@chakra-ui/react";
import { isEmpty } from "lodash";
import React, { useState } from "react";
import { BaseType, TypeDefinition } from "../HathoraTypes";

interface ITypeNameHeaderProps {
    definition: TypeDefinition;
    updateDefinition: (definition: TypeDefinition) => void;
    deleteType: () => void;
}

export function TypeNameHeader({
    definition, updateDefinition, deleteType,
}: ITypeNameHeaderProps) {
    const [errorMessage, setErrorMessage] = useState("");

    const onSubmit = (nextValue: string) => {
        if (definition.name === nextValue) {
            return;
        }

        const parsed = BaseType.shape.name.safeParse(nextValue);
        if (!parsed.success) {
            setErrorMessage(parsed.error.issues[0].message);
            return;
        }

        updateDefinition({
            ...definition,
            name: nextValue,
        });
    };

    return (
        <FormControl isInvalid={!isEmpty(errorMessage)}>
            <HStack direction='row'>
                <Editable
                    defaultValue={definition.name}
                    onSubmit={onSubmit}
                    fontWeight='semibold'
                >
                    <EditablePreview />
                    <EditableInput />
                </Editable>
                <Badge colorScheme='blue'>{definition.type}</Badge>
                <IconButton
                    size='xs'
                    colorScheme='red'
                    aria-label='delete'
                    onClick={deleteType}
                    icon={<DeleteIcon />}
                />
            </HStack>
            <FormErrorMessage>{errorMessage}</FormErrorMessage>
        </FormControl>
    );
}
