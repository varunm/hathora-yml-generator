import {
    Editable,
    EditableInput,
    EditablePreview,
    FormControl,
    FormErrorMessage,
    HStack,
    VStack,
} from "@chakra-ui/react";
import { isEmpty, map, set } from "lodash";
import React, { useState } from "react";
import { TypeDescription } from "../../HathoraTypes";
import { ArrayIconButton } from "../iconButtons/ArrayIconButton";
import { DeleteIconButton } from "../iconButtons/DeleteIconButton";
import { OptionalIconButton } from "../iconButtons/OptionalIconButton";
import { TypeSelector } from "../TypeSelector";

interface IFieldSetEditorProps {
    fields: {[name: string]: TypeDescription};
    updateFields: (fields: {[name: string]: TypeDescription}) => void;
    availableTypes: string[];
}

export function FieldSetEditor({
    fields, updateFields, availableTypes,
}: IFieldSetEditorProps) {
    const [errorMessages, setErrorMessages] = useState<{[key: string]: string}>({});

    const onFieldNameUpdated = (fieldName: string) => (nextValue: string) => {
        if (nextValue === fieldName) {
            return;
        }

        if (Object.keys(fields).includes(nextValue)) {
            setErrorMessages({
                ...errorMessages,
                [fieldName]: "Field already exists with this name",
            });
            return;
        }

        const parsed = TypeDescription.shape.type.safeParse(nextValue);
        if (!parsed.success) {
            setErrorMessages({
                ...errorMessages,
                [fieldName]: parsed.error.issues[0].message,
            });
            return;
        }

        const newFields = {
            ...fields,
        };
        newFields[nextValue] = newFields[fieldName];
        delete newFields[fieldName];

        updateFields(newFields);
        const newErrorMessages = {
            ...errorMessages,
        };
        delete newErrorMessages[fieldName];
        setErrorMessages(newErrorMessages);
    };

    const onSelect = (fieldName: string) => (event: React.ChangeEvent<HTMLSelectElement>) => {
        const newFields = {
            ...fields,
        };
        set(newFields, [fieldName, "type"], event.target.value);
        updateFields(newFields);
    };

    const isArrayToggled = (fieldName: string) => () => {
        const newFields = {
            ...fields,
        };
        set(newFields, [fieldName, "isArray"], !fields[fieldName].isArray);
        updateFields(newFields);
    };

    const isOptionalToggled = (fieldName: string) => () => {
        const newFields = {
            ...fields,
        };
        set(newFields, [fieldName, "isOptional"], !fields[fieldName].isOptional);
        updateFields(newFields);
    };

    const deleteField = (fieldName: string) => () => {
        const newFields: {[name: string]: TypeDescription} = {
            ...fields,
        };
        delete newFields[fieldName];
        updateFields(newFields);
    };

    return (
        <VStack paddingLeft='5'>
            {map(fields, (field, name) =>
                <FormControl key={name} isInvalid={!isEmpty(errorMessages[name])}>
                    <HStack>
                        <Editable
                            defaultValue={name}
                            onSubmit={onFieldNameUpdated(name)}
                        >
                            <EditablePreview />
                            <EditableInput />
                        </Editable>
                        <TypeSelector onChange={onSelect(name)} selectedValue={field.type} availableTypes={availableTypes}/>
                        <ArrayIconButton isSelected={field.isArray} onClick={isArrayToggled(name)} />
                        <OptionalIconButton isSelected={field.isOptional} onClick={isOptionalToggled(name)} />
                        <DeleteIconButton onClick={deleteField(name)} />
                    </HStack>
                    <FormErrorMessage>{errorMessages[name]}</FormErrorMessage>
                </FormControl>
            )}
        </VStack>
    );
}
