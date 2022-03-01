import { DeleteIcon } from "@chakra-ui/icons";
import {
    Badge,
    Editable,
    EditableInput,
    EditablePreview,
    HStack,
    IconButton,
} from "@chakra-ui/react";
import React from "react";
import { TypeDefinition } from "../HathoraTypes";

interface ITypeNameHeaderProps {
    definition: TypeDefinition;
    updateDefinition: (definition: TypeDefinition) => void;
    deleteType: () => void;
}

export function TypeNameHeader({
    definition, updateDefinition, deleteType,
}: ITypeNameHeaderProps) {
    const onSubmit = (nextValue: string) => {
        updateDefinition({
            ...definition,
            name: nextValue,
        });
    };
    return (
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
    );
}
