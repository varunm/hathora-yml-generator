import {
    Editable,
    EditableInput,
    EditablePreview,
    FormControl,
    FormErrorMessage,
    HStack,
    VStack,
} from "@chakra-ui/react";
import { difference, isEmpty, map, set } from "lodash";
import React, { useContext, useState } from "react";
import { ZodIssue } from "zod";
import { TypeDescription } from "../../HathoraTypes";
import { IssuesContext } from "../../util";
import { ArrayIconButton } from "../iconButtons/ArrayIconButton";
import { DeleteIconButton } from "../iconButtons/DeleteIconButton";
import { OptionalIconButton } from "../iconButtons/OptionalIconButton";
import { TypeSelector } from "../TypeSelector";

interface IFieldSetEditorProps {
    fields: {[name: string]: TypeDescription};
    updateFields: (fields: {[name: string]: TypeDescription}) => void;
    availableTypes: string[];
    parentPath: (string | number)[];
}

export function FieldSetEditor({
    fields, updateFields, availableTypes, parentPath,
}: IFieldSetEditorProps) {
    const issues: ZodIssue[] = useContext(IssuesContext).filter(
        issue => difference(parentPath.concat(["fields"]), issue.path).length === 0
    );
    const [errorMessages, setErrorMessages] = useState<{[key: string]: string}>({});

    const onFieldNameUpdated = (fieldName: string) => (nextValue: string) => {
        if (nextValue === fieldName) {
            const newErrorMessages = {
                ...errorMessages,
            };
            delete newErrorMessages[fieldName];
            setErrorMessages(newErrorMessages);
            return;
        }

        if (Object.keys(fields).includes(nextValue)) {
            setErrorMessages({
                ...errorMessages,
                [fieldName]: "Field already exists with this name",
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

    const issuesForField = (fieldName: string): ZodIssue[] => {
        return issues.filter(
            issue => difference(parentPath.concat(["fields", fieldName]), issue.path).length === 0
        );
    };

    return (
        <VStack paddingLeft='5'>
            {map(fields, (field, name) =>
                <FormControl key={name} isInvalid={!isEmpty(issuesForField(name))}>
                    <HStack>
                        <FormControl isInvalid={!isEmpty(errorMessages[name])}>
                            <Editable
                                defaultValue={name}
                                onSubmit={onFieldNameUpdated(name)}
                            >
                                <EditablePreview />
                                <EditableInput />
                            </Editable>
                            <FormErrorMessage>{errorMessages[name]}</FormErrorMessage>
                        </FormControl>
                        <TypeSelector onChange={onSelect(name)} selectedValue={field.type} availableTypes={availableTypes}/>
                        <ArrayIconButton isSelected={field.isArray} onClick={isArrayToggled(name)} />
                        <OptionalIconButton isSelected={field.isOptional} onClick={isOptionalToggled(name)} />
                        <DeleteIconButton onClick={deleteField(name)} />
                    </HStack>
                    <FormErrorMessage>{isEmpty(issuesForField(name)) ? "" : issuesForField(name)[0].message}</FormErrorMessage>
                </FormControl>
            )}
        </VStack>
    );
}
