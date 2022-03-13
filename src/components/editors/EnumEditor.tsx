import {
    Editable,
    EditableInput,
    EditablePreview,
    FormControl,
    FormErrorMessage,
    HStack,
    Tag,
    TagCloseButton,
    TagLabel,
    VStack,
    Wrap,
} from "@chakra-ui/react";
import {
    difference,
    filter,
    isEmpty,
    map,
    uniq,
} from "lodash";
import React, { useContext, useState } from "react";
import { ZodIssue } from "zod";
import { EnumType, TypeDefinition } from "../../HathoraTypes";
import { IssuesContext } from "../../util";
import { AddIconButton } from "../iconButtons/AddIconButton";
import { TypeNameHeader } from "../TypeNameHeader";

interface IEnumEditorProps {
    definition: EnumType;
    updateDefinition: (definition: TypeDefinition) => void;
    deleteType: () => void;
}

export function EnumEditor({
    definition, updateDefinition, deleteType,
}: IEnumEditorProps) {
    const issues: ZodIssue[] = useContext(IssuesContext).filter(
        issue => difference(["types", definition.name, "enums"], issue.path).length === 0
    );
    const [addMode, setAddMode] = useState(false);

    const onNewEnumAdded = (nextValue: string) => {
        if (isEmpty(nextValue)) {
            setAddMode(false);
            return;
        }
        const newEnums = [...definition.enums];
        newEnums.push(nextValue);
        updateDefinition({
            ...definition,
            enums: uniq(newEnums),
        });
        setAddMode(false);
    };

    const onEnumDeleted = (enumLabel: string) => () => {
        updateDefinition({
            ...definition,
            enums: filter(definition.enums, label => label !== enumLabel),
        });
    };

    const addEnum = () => {
        setAddMode(true);
    };

    return (
        <VStack align='flex-start' key={definition.name} backgroundColor='gray.100' width='100%' padding='2'>
            <HStack>
                <TypeNameHeader definition={definition} updateDefinition={updateDefinition} deleteType={deleteType} />
                <AddIconButton onClick={addEnum} />
            </HStack>
            <FormControl isInvalid={!isEmpty(issues)}>
                <Wrap>
                    {map(definition.enums.sort(), enumLabel =>
                        <Tag
                            size='md'
                            key={enumLabel}
                            borderRadius='full'
                            variant='solid'
                            colorScheme='green'
                        >
                            <TagLabel>{enumLabel}</TagLabel>
                            <TagCloseButton onClick={onEnumDeleted(enumLabel)} />
                        </Tag>
                    )}
                </Wrap>
                <FormErrorMessage>{isEmpty(issues) ? "" : issues[0].message}</FormErrorMessage>
            </FormControl>
            <FormControl hidden={!addMode}>
                <Editable
                    placeholder="Add new Enum value"
                    submitOnBlur={false}
                    onSubmit={onNewEnumAdded}
                    startWithEditView={true}
                >
                    <EditablePreview />
                    <EditableInput />
                </Editable>
            </FormControl>
        </VStack>
    );
}
