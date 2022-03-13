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
import { MethodDefinition } from "../HathoraTypes";
import { IssuesContext } from "../util";

interface IMethodNameHeaderProps {
    definition: MethodDefinition;
    updateDefinition: (definition: MethodDefinition) => void;
    deleteMethod: () => void;
}

export function MethodNameHeader({
    definition, updateDefinition, deleteMethod,
}: IMethodNameHeaderProps) {
    const issues: ZodIssue[] = useContext(IssuesContext).filter(
        issue => isEqual(issue.path, ["methods", definition.name, "name"])
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
                >
                    <EditablePreview />
                    <EditableInput />
                </Editable>
                <Badge colorScheme='blue'>Method</Badge>
                <IconButton
                    size='xs'
                    colorScheme='red'
                    aria-label='delete'
                    onClick={deleteMethod}
                    icon={<DeleteIcon />}
                />
            </HStack>
            <FormErrorMessage>{isEmpty(issues) ? "" : issues[0].message}</FormErrorMessage>
        </FormControl>
    );
}
