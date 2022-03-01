import {
    HStack,
    IconButton,
    Select,
    Tooltip,
    VStack,
} from "@chakra-ui/react";
import { map } from "lodash";
import React from "react";
import { RiQuestionMark } from "react-icons/ri";
import { VscSymbolArray } from "react-icons/vsc";
import { PRIMITIVES } from "../../constants";
import { AliasType, TypeDefinition } from "../../HathoraTypes";
import { TypeNameHeader } from "../TypeNameHeader";

interface IAliasEditorProps {
    definition: AliasType;
    updateDefinition: (definition: TypeDefinition) => void;
    deleteType: () => void;
}

export function AliasEditor({
    definition, updateDefinition, deleteType,
}: IAliasEditorProps) {

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
        <VStack align='flex-start' direction='column' key={definition.name}>
            <TypeNameHeader definition={definition} updateDefinition={updateDefinition} deleteType={deleteType} />
            <HStack direction='row'>
                <Select size='sm' placeholder='Select option' onChange={onSelect} value={definition.typeDescription.type}>
                    {map(Object.values(PRIMITIVES), value => <option key={value} value={value}>{value}</option>)}
                </Select>
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
        </VStack>
    );
}
