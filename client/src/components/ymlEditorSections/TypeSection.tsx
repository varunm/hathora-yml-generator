import { Heading, VStack } from "@chakra-ui/react";
import { map } from "lodash";
import React from "react";
import { TypeDefinition } from "../../HathoraTypes";
import { AddNewType } from "../AddNewType";
import { AliasEditor } from "../editors/AliasEditor";
import { EnumEditor } from "../editors/EnumEditor";
import { ObjectEditor } from "../editors/ObjectEditor";
import { UnionEditor } from "../editors/UnionEditor";
import { TypeNameHeader } from "../TypeNameHeader";

interface ITypeSectionProps {
    types: TypeDefinition[];
    setTypes: (types: TypeDefinition[], prevTypeName?: string, newTypeName?: string) => void;
    updateTypeNamesInConfig: (prevTypeName: string, newTypeName: string) => void;
}

export function TypeSection({
    types, setTypes, updateTypeNamesInConfig,
}: ITypeSectionProps) {

    const deleteType = (index: number) => () => {
        const updatedTypes = [...types];
        updatedTypes.splice(index, 1);
        setTypes(updatedTypes);
    };

    const updateDefinition = (index: number) => (definition: TypeDefinition) => {
        const updatedTypes = [...types];
        const prevTypeName = updatedTypes[index].name;
        updatedTypes[index] = definition;
        setTypes(updatedTypes, prevTypeName, definition.name);
    };

    const addNewType = (newType: TypeDefinition) => {
        const updatedTypes = [...types];
        updatedTypes.push(newType);
        setTypes(updatedTypes);
    };

    const getAvailableTypes = (definition: TypeDefinition) => {
        return types.map(type => type.name).filter(typeName => typeName !== definition.name);
    };

    const typeNameHeader = (definition: TypeDefinition, index: number) => {
        return (
            <TypeNameHeader
                updateTypeNamesInConfig={updateTypeNamesInConfig}
                definition={definition}
                updateDefinition={updateDefinition(index)}
                deleteType={deleteType(index)}
            />
        );
    };

    const renderType = (definition: TypeDefinition, index: number) => {
        if (definition.type === "Alias") {
            return (
                <AliasEditor
                    availableTypes={getAvailableTypes(definition)}
                    key={definition.name}
                    definition={definition}
                    updateDefinition={updateDefinition(index)}
                    typeNameHeader={typeNameHeader(definition, index)}
                />
            );
        }
        if (definition.type === "Enum") {
            return (
                <EnumEditor
                    key={definition.name}
                    definition={definition}
                    updateDefinition={updateDefinition(index)}
                    typeNameHeader={typeNameHeader(definition, index)}
                />
            );
        }
        if (definition.type === "Union") {
            return (
                <UnionEditor
                    availableTypes={getAvailableTypes(definition)}
                    key={definition.name}
                    definition={definition}
                    updateDefinition={updateDefinition(index)}
                    typeNameHeader={typeNameHeader(definition, index)}
                />
            );
        }
        if (definition.type === "Object") {
            return (
                <ObjectEditor
                    availableTypes={getAvailableTypes(definition)}
                    key={definition.name}
                    definition={definition}
                    updateDefinition={updateDefinition(index)}
                    typeNameHeader={typeNameHeader(definition, index)}
                />
            );
        }
    };

    return (
        <VStack align='flex-start' width='100%'>
            <Heading size='md'>Types</Heading>
            {map(types, renderType)}
            <AddNewType addNewType={addNewType} />
        </VStack>
    );
}
