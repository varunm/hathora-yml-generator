import { Editable, EditableInput, EditablePreview } from "@chakra-ui/react";
import React from "react";

interface ITypeNameProps {
    name: string;
    onSubmit: (nextValue: string) => void;
}

export function TypeName({ name, onSubmit }: ITypeNameProps) {
    return (
        <Editable
            defaultValue={name}
            onSubmit={onSubmit}
        >
            <EditablePreview />
            <EditableInput />
        </Editable>
    );
}
