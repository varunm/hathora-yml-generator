import {
    FormControl,
    FormErrorMessage,
    HStack,
    Tag,
    TagCloseButton,
    TagLabel,
    VStack,
    Wrap,
} from "@chakra-ui/react";
import {
    difference,
    filter,
    isEmpty,
    map,
    uniq,
} from "lodash";
import React, { useContext, useState } from "react";
import { ZodIssue } from "zod";
import { UnionType, TypeDefinition } from "../../HathoraTypes";
import { IssuesContext } from "../../util";
import { AddIconButton } from "../iconButtons/AddIconButton";
import { CheckIconButton } from "../iconButtons/CheckIconButton";
import { TypeNameHeader } from "../TypeNameHeader";
import { TypeSelector } from "../TypeSelector";

interface IUnionEditorProps {
    definition: UnionType;
    updateDefinition: (definition: TypeDefinition) => void;
    deleteType: () => void;
    availableTypes: string[];
}

export function UnionEditor({
    definition, updateDefinition, deleteType, availableTypes,
}: IUnionEditorProps) {
    const issues: ZodIssue[] = useContext(IssuesContext).filter(
        issue => difference(["types", definition.name, "unions"], issue.path).length === 0
    );
    const [addMode, setAddMode] = useState(false);
    const [newUnion, setNewUnion] = useState<string>("");

    const onSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setNewUnion(event.target.value);
    };

    const onNewUnionAdded = () => {
        if (isEmpty(newUnion)) {
            setAddMode(false);
            return;
        }

        const newUnions = [...definition.unions];
        newUnions.push(newUnion);
        updateDefinition({
            ...definition,
            unions: uniq(newUnions),
        });
        setAddMode(false);
        setNewUnion("");
    };

    const onUnionDeleted = (unionLabel: string) => () => {
        updateDefinition({
            ...definition,
            unions: filter(definition.unions, label => label !== unionLabel),
        });
    };

    const addUnion = () => {
        setAddMode(true);
    };

    const filteredTypes = () => {
        return availableTypes.filter(type => !definition.unions.includes(type));
    };

    const unionLabels = definition.unions;
    unionLabels.sort();

    return (
        <VStack align='flex-start' key={definition.name} backgroundColor='gray.100' width='100%' padding='2'>
            <HStack>
                <TypeNameHeader definition={definition} updateDefinition={updateDefinition} deleteType={deleteType} />
                <AddIconButton onClick={addUnion} />
            </HStack>
            <FormControl hidden={!addMode}>
                <HStack>
                    <TypeSelector onChange={onSelect} selectedValue={newUnion} availableTypes={filteredTypes()}/>
                    <CheckIconButton onClick={onNewUnionAdded}/>
                </HStack>
            </FormControl>
            <FormControl isInvalid={!isEmpty(issues)}>
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
                <FormErrorMessage>{isEmpty(issues) ? "" : issues[0].message}</FormErrorMessage>
            </FormControl>
        </VStack>
    );
}
