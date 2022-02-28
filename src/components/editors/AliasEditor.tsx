import {
    Checkbox,
    CloseButton,
    Flex,
    Select,
    Stack,
} from "@chakra-ui/react";
import { map } from "lodash";
import React from "react";
import { PRIMITIVES } from "../../constants";
import { AliasType, TypeDefinition } from "../../HathoraTypes";
import { TypeName } from "../TypeName";

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

    const isArrayCheckboxToggled = () => {
        updateDefinition({
            ...definition,
            typeDescription: {
                ...definition.typeDescription,
                isArray: !definition.typeDescription.isArray,
            },
        });
    };

    const isOptionalCheckboxToggled = () => {
        updateDefinition({
            ...definition,
            typeDescription: {
                ...definition.typeDescription,
                isOptional: !definition.typeDescription.isOptional,
            },
        });
    };

    return (
        <Flex direction='row' key={definition.name} mb='2'>
            <TypeName definition={definition} updateDefinition={updateDefinition} />
            <Select placeholder='Select option' onChange={onSelect} value={definition.typeDescription.type}>
                {map(Object.values(PRIMITIVES), value => <option key={value} value={value}>{value}</option>)}
            </Select>
            <Stack ml='2' spacing={[1, 5]} direction={["column", "row"]}>
                <Checkbox colorScheme='green' isChecked={definition.typeDescription.isArray} onChange={isArrayCheckboxToggled}>Array</Checkbox>
                <Checkbox colorScheme='green' isChecked={definition.typeDescription.isOptional} onChange={isOptionalCheckboxToggled}>Optional</Checkbox>
            </Stack>
            <CloseButton onClick={deleteType}/>
        </Flex>
    );
}
