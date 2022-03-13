import {
    FormControl,
    FormErrorMessage,
    HStack,
    IconButton,
    Tooltip,
    VStack,
} from "@chakra-ui/react";
import { isEmpty, isEqual } from "lodash";
import React, { useContext } from "react";
import { RiQuestionMark } from "react-icons/ri";
import { VscSymbolArray } from "react-icons/vsc";
import { ZodIssue } from "zod";
import { AliasType, TypeDefinition } from "../../HathoraTypes";
import { IssuesContext } from "../../util";
import { TypeNameHeader } from "../TypeNameHeader";
import { TypeSelector } from "../TypeSelector";

interface IAliasEditorProps {
    definition: AliasType;
    updateDefinition: (definition: TypeDefinition) => void;
    deleteType: () => void;
    availableTypes: string[];
}

export function AliasEditor({
    definition, updateDefinition, deleteType, availableTypes,
}: IAliasEditorProps) {
    const issues: ZodIssue[] = useContext(IssuesContext).filter(
        issue => isEqual(issue.path, ["types", definition.name, "typeDescription", "type"])
    );

    const onSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
        updateDefinition({
            ...definition,
            typeDescription: {
                ...definition.typeDescription,
                type: event.target.value,
            },
        });
    };

    const isArrayToggled = () => {
        updateDefinition({
            ...definition,
            typeDescription: {
                ...definition.typeDescription,
                isArray: !definition.typeDescription.isArray,
            },
        });
    };

    const isOptionalToggled = () => {
        updateDefinition({
            ...definition,
            typeDescription: {
                ...definition.typeDescription,
                isOptional: !definition.typeDescription.isOptional,
            },
        });
    };

    return (
        <VStack align='flex-start' key={definition.name} backgroundColor='gray.100' width='100%' padding='2'>
            <TypeNameHeader definition={definition} updateDefinition={updateDefinition} deleteType={deleteType} />
            <FormControl isInvalid={!isEmpty(issues)}>
                <HStack direction='row'>
                    <TypeSelector onChange={onSelect} selectedValue={definition.typeDescription.type} availableTypes={availableTypes}/>
                    <Tooltip label="Convert to array" placement="top" openDelay={200}>
                        <IconButton
                            size='sm'
                            variant={definition.typeDescription.isArray ? "solid" : "outline"}
                            colorScheme='teal'
                            aria-label='isArray'
                            fontSize='18px'
                            onClick={isArrayToggled}
                            icon={<VscSymbolArray />}
                        />
                    </Tooltip>
                    <Tooltip label="Convert to optional" placement="top" openDelay={200}>
                        <IconButton
                            size='sm'
                            variant={definition.typeDescription.isOptional ? "solid" : "outline"}
                            colorScheme='teal'
                            aria-label='isOptional'
                            fontSize='18px'
                            onClick={isOptionalToggled}
                            icon={<RiQuestionMark />}
                        />
                    </Tooltip>
                </HStack>
                <FormErrorMessage>{isEmpty(issues) ? "" : issues[0].message}</FormErrorMessage>
            </FormControl>
        </VStack>
    );
}
