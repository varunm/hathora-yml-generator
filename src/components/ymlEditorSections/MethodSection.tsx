import { Heading, HStack, VStack } from "@chakra-ui/react";
import { map } from "lodash";
import React from "react";
import { MethodDefinition } from "../../HathoraTypes";
import { MethodEditor } from "../editors/MethodEditor";
import { AddIconButton } from "../iconButtons/AddIconButton";

interface IMethodSectionProps {
    methods: MethodDefinition[];
    setMethods: (methods: MethodDefinition[]) => void;
    availableTypes: string[];
}

export function MethodSection({
    methods, setMethods, availableTypes,
}: IMethodSectionProps) {
    const deleteMethod = (index: number) => () => {
        const updatedMethods = [...methods];
        updatedMethods.splice(index, 1);
        setMethods(updatedMethods);
    };

    const updateDefinition = (index: number) => (definition: MethodDefinition) => {
        const updatedMethods = [...methods];
        updatedMethods[index] = definition;
        setMethods(updatedMethods);
    };

    const addMethod = () => {
        const updatedMethods = [...methods];
        updatedMethods.push({
            name: "newMethod",
            fields: {},
        });
        setMethods(updatedMethods);
    };

    const renderMethod = (definition: MethodDefinition, index: number) => {
        return (
            <MethodEditor key={definition.name} definition={definition} updateDefinition={updateDefinition(index)} deleteMethod={deleteMethod(index)} availableTypes={availableTypes} />
        );
    };

    return (
        <VStack align='flex-start' width='100%'>
            <HStack>
                <Heading size='md'>Methods</Heading>
                <AddIconButton onClick={addMethod} />
            </HStack>
            {map(methods, renderMethod)}
        </VStack>
    );
}
