import { HStack, VStack } from "@chakra-ui/react";
import React from "react";
import { ObjectType, TypeDefinition, TypeDescription } from "../../HathoraTypes";
import { AddIconButton } from "../iconButtons/AddIconButton";
import { TypeNameHeader } from "../TypeNameHeader";
import { FieldSetEditor } from "./FieldSetEditor";

interface IObjectEditorProps {
    definition: ObjectType;
    updateDefinition: (definition: TypeDefinition) => void;
    deleteType: () => void;
    availableTypes: string[];
}

export function ObjectEditor({
    definition, updateDefinition, deleteType, availableTypes,
}: IObjectEditorProps) {
    const updateFields = (fields: {[name: string]: TypeDescription}) => {
        const newDefinition: ObjectType = {
            ...definition,
            fields: {
                ...fields,
            },
        };

        updateDefinition(newDefinition);
    };

    const addField = () => {
        const newFields: {[name: string]: TypeDescription} = {
            ...definition.fields,
            "newProperty": {
                type: "string",
            },
        };

        updateDefinition({
            ...definition,
            fields: newFields,
        });
    };

    return (
        <VStack align='flex-start' key={definition.name} backgroundColor='gray.100' width='100%' padding='2'>
            <HStack>
                <TypeNameHeader definition={definition} updateDefinition={updateDefinition} deleteType={deleteType} />
                <AddIconButton onClick={addField} />
            </HStack>
            <FieldSetEditor parentPath={["types", definition.name]} fields={definition.fields} updateFields={updateFields} availableTypes={availableTypes} />
        </VStack>
    );
}
