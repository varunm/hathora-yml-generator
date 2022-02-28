import { Editable, EditableInput, EditablePreview } from "@chakra-ui/react";
import React from "react";
import { TypeDefinition } from "../HathoraTypes";

interface ITypeNameProps {
    // name: string;
    // onSubmit: (nextValue: string) => void;
    definition: TypeDefinition;
    updateDefinition: (definition: TypeDefinition) => void;
}

export function TypeName({ definition, updateDefinition }: ITypeNameProps) {
    const onSubmit = (nextValue: string) => {
        updateDefinition({
            ...definition,
            name: nextValue,
        });
    };
    return (
        <Editable
            defaultValue={definition.name}
            onSubmit={onSubmit}
        >
            <EditablePreview />
            <EditableInput />
        </Editable>
    );
}
