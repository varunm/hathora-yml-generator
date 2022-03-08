import { HStack, VStack } from "@chakra-ui/react";
import React from "react";
import { MethodDefinition, TypeDescription } from "../../HathoraTypes";
import { AddIconButton } from "../iconButtons/AddIconButton";
import { MethodNameHeader } from "../MethodNameHeader";
import { FieldSetEditor } from "./FieldSetEditor";

interface IMethodEditorProps {
    definition: MethodDefinition;
    updateDefinition: (definition: MethodDefinition) => void;
    deleteMethod: () => void;
    availableTypes: string[];
}

export function MethodEditor({
    definition, updateDefinition, deleteMethod, availableTypes,
}: IMethodEditorProps) {
    const updateFields = (fields: {[name: string]: TypeDescription}) => {
        const newDefinition: MethodDefinition = {
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
                <MethodNameHeader definition={definition} updateDefinition={updateDefinition} deleteMethod={deleteMethod} />
                <AddIconButton onClick={addField} />
            </HStack>
            <FieldSetEditor fields={definition.fields} updateFields={updateFields} availableTypes={availableTypes} />
        </VStack>
    );
}
