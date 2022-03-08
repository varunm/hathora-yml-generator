import { VStack } from "@chakra-ui/react";
import React, { useMemo } from "react";
import { MethodDefinition, TypeDefinition } from "../HathoraTypes";
import { ErrorSection } from "./ymlEditorSections/ErrorSection";
import { MethodSection } from "./ymlEditorSections/MethodSection";
import { TypeSection } from "./ymlEditorSections/TypeSection";
import { UserStateSection } from "./ymlEditorSections/UserStateSection";

interface IYMLEditorProps {
    types: TypeDefinition[];
    setTypes: (types: TypeDefinition[]) => void;
    methods: MethodDefinition[];
    setMethods: (methods: MethodDefinition[]) => void;
    userState: string;
    setUserState: (methodName: string) => void;
    errorType: string;
    setErrorType: (errorType: string) => void;
}

export function YMLEditor({
    types, setTypes, methods, setMethods, userState, setUserState, errorType, setErrorType,
}: IYMLEditorProps) {

    const availableTypes = useMemo(() => {
        return types.map(type => type.name);
    }, [types]);

    return (
        <VStack align='flex-start' width='100%'>
            <TypeSection types={types} setTypes={setTypes}/>
            <MethodSection methods={methods} setMethods={setMethods} availableTypes={availableTypes} />
            <UserStateSection userState={userState} setUserState={setUserState} availableTypes={availableTypes}/>
            <ErrorSection errorType={errorType} setErrorType={setErrorType} availableTypes={availableTypes}/>
        </VStack>
    );
}
