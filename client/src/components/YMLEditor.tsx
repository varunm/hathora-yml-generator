import { VStack } from "@chakra-ui/react";
import {
    cloneDeep,
    forEach,
    get,
    isEqual,
    keyBy,
    map,
    set,
    values,
} from "lodash";
import React, { useMemo } from "react";
import { ZodIssue } from "zod";
import { Auth, HathoraYmlDefinition, MethodDefinition, TypeDefinition } from "../HathoraTypes";
import { IssuesContext } from "../util";
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

    const setTypes = (types: TypeDefinition[], prevTypeName?: string, newTypeName?: string) => {
        const newConfig = {
            ...cloneDeep(config),
            types: keyBy(types, "name"),
        };

        // Rename type everywhere if necessary
        if (prevTypeName !== undefined && newTypeName !== undefined && !isEqual(prevTypeName, newTypeName)) {
            forEach(config.types, type => {
                if (type.type === "Alias") {
                    if (type.typeDescription.type === prevTypeName) {
                        set(newConfig, ["types", type.name, "typeDescription", "type"], newTypeName);
                    }
                }
                if (type.type === "Object") {
                    forEach(type.fields, (field, fieldName) => {
                        if (field.type === prevTypeName) {
                            set(newConfig, ["types", type.name, "fields", fieldName, "type"], newTypeName);
                        }
                    });
                }
                if (type.type === "Union") {
                    const newUnions = map(type.unions, label => label === prevTypeName ? newTypeName : label);
                    set(newConfig, ["types", type.name, "unions"], newUnions);
                }
            });
            forEach(config.methods, method => {
                forEach(method.fields, (field, fieldName) => {
                    if (field.type === prevTypeName) {
                        set(newConfig, ["methods", method.name, "fields", fieldName, "type"], newTypeName);
                    }
                });
            });
            if (config.userState === prevTypeName) {
                newConfig.userState = newTypeName;
            }
            if (config.error === prevTypeName) {
                newConfig.error = newTypeName;
            }
        }
        setConfig(newConfig);
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

    const updateTypeNamesInConfig = (prevTypeName: string, newTypeName: string) => {
        const newConfig = cloneDeep(config);

        forEach(config.types, type => {
            if (type.type === "Alias") {
                if (get(config, ["typeDescription", "type"]) === prevTypeName) {
                    set(newConfig, ["typeDescription", "type"], newTypeName);
                }
            }
        });

        setConfig(newConfig);
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
                <TypeSection types={values(config.types)} setTypes={setTypes} updateTypeNamesInConfig={updateTypeNamesInConfig} />
                <MethodSection methods={values(config.methods)} setMethods={setMethods} availableTypes={availableTypes} />
                <UserStateSection userState={config.userState} setUserState={setUserState} availableTypes={availableTypes}/>
                <ErrorSection error={config.error} setError={setError} availableTypes={availableTypes}/>
                <TickSection tick={config.tick} setTick={setTick} />
                <AuthSection auth={config.auth} setAuth={setAuth} />
            </VStack>
        </IssuesContext.Provider>
    );
}
