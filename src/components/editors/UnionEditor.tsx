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
import { filter, isEmpty, map } from "lodash";
import React, { useState } from "react";
import { UnionType, TypeDefinition } from "../../HathoraTypes";
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
    const [addMode, setAddMode] = useState(false);
    const [newUnion, setNewUnion] = useState<string>("");
    const [errorMessage, setErrorMessage] = useState("");

    const onSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setNewUnion(event.target.value);
    };

    const onNewUnionAdded = () => {
        if (definition.unions.includes(newUnion)) {
            setErrorMessage("Value must be unique");
            return;
        }

        if (isEmpty(newUnion)) {
            setErrorMessage("Value must be not be empty");
            return;
        }

        const newUnions = [...definition.unions];
        newUnions.push(newUnion);
        updateDefinition({
            ...definition,
            unions: newUnions,
        });
        setErrorMessage("");
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
            <FormControl hidden={!addMode} isInvalid={!isEmpty(errorMessage)}>
                <HStack>
                    <TypeSelector onChange={onSelect} selectedValue={newUnion} availableTypes={filteredTypes()}/>
                    <CheckIconButton onClick={onNewUnionAdded}/>
                </HStack>
                <FormErrorMessage>{errorMessage}</FormErrorMessage>
            </FormControl>
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
        </VStack>
    );
}
