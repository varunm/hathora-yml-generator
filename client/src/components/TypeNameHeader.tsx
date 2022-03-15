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
import { isEmpty, isEqual } from "lodash";
import React, { useContext } from "react";
import { ZodIssue } from "zod";
import { TypeDefinition } from "../HathoraTypes";
import { IssuesContext } from "../util";

interface ITypeNameHeaderProps {
    definition: TypeDefinition;
    updateDefinition: (definition: TypeDefinition) => void;
    deleteType: () => void;
}

export function TypeNameHeader({
    definition, updateDefinition, deleteType,
}: ITypeNameHeaderProps) {
    const issues: ZodIssue[] = useContext(IssuesContext).filter(
        issue => isEqual(issue.path, ["types", definition.name, "name"])
    );

    const onSubmit = (nextValue: string) => {
        if (definition.name === nextValue || isEmpty(nextValue)) {
            return;
        }
        updateDefinition({
            ...definition,
            name: nextValue,
        });
    };

    return (
        <FormControl isInvalid={!isEmpty(issues)}>
            <HStack direction='row'>
                <Editable
                    defaultValue={definition.name}
                    onSubmit={onSubmit}
                    fontWeight='semibold'
                    placeholder="TypeName"
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
            <FormErrorMessage>{isEmpty(issues) ? "" : issues[0].message}</FormErrorMessage>
        </FormControl>
    );
}
