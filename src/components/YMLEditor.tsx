import { VStack } from "@chakra-ui/react";
import { cloneDeep, keyBy, values } from "lodash";
import React, { useMemo } from "react";
import { ZodIssue } from "zod";
import { Auth, HathoraYmlDefinition, MethodDefinition, TypeDefinition } from "../HathoraTypes";
import { filterIssues, IssuesContext } from "../util";
import { AuthSection } from "./ymlEditorSections/AuthSection";
import { ErrorSection } from "./ymlEditorSections/ErrorSection";
import { MethodSection } from "./ymlEditorSections/MethodSection";
import { TickSection } from "./ymlEditorSections/TickSection";
import { TypeSection } from "./ymlEditorSections/TypeSection";
import { UserStateSection } from "./ymlEditorSections/UserStateSection";

interface IYMLEditorProps {
    config: HathoraYmlDefinition;
    setConfig: (config: HathoraYmlDefinition) => void;
}

export function YMLEditor({ config, setConfig }: IYMLEditorProps) {

    const availableTypes = useMemo(() => {
        return values(config.types).map(type => type.name);
    }, [config]);

    const setTypes = (types: TypeDefinition[]) => {
        setConfig({
            ...cloneDeep(config),
            types: keyBy(types, "name"),
        });
    };

    const setMethods = (methods: MethodDefinition[]) => {
        setConfig({
            ...cloneDeep(config),
            methods: keyBy(methods, "name"),
        });
    };

    const setUserState = (userState: string) => {
        setConfig({
            ...cloneDeep(config),
            userState,
        });
    };

    const setError = (error: string) => {
        setConfig({
            ...cloneDeep(config),
            error,
        });
    };

    const setTick = (tick: number | undefined) => {
        setConfig({
            ...cloneDeep(config),
            tick,
        });
    };

    const setAuth = (auth: Auth) => {
        setConfig({
            ...cloneDeep(config),
            auth,
        });
    };

    const issues: ZodIssue[] = useMemo(() => {
        const parsed = HathoraYmlDefinition.safeParse(config);
        if (!parsed.success) {
            return parsed.error.issues;
        } else {
            return [];
        }
    }, [config]);

    return (
        <IssuesContext.Provider value={issues}>
            <VStack align='flex-start' width='100%'>
                <TypeSection types={values(config.types)} setTypes={setTypes} issues={filterIssues(issues, "types")} />
                <MethodSection methods={values(config.methods)} setMethods={setMethods} availableTypes={availableTypes} />
                <UserStateSection userState={config.userState} setUserState={setUserState} availableTypes={availableTypes}/>
                <ErrorSection error={config.error} setError={setError} availableTypes={availableTypes}/>
                <TickSection tick={config.tick} setTick={setTick} />
                <AuthSection auth={config.auth} setAuth={setAuth} />
            </VStack>
        </IssuesContext.Provider>
    );
}
