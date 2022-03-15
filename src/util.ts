import { cloneDeep, forEach, get, set } from "lodash";
import { createContext } from "react";
import { ZodIssue } from "zod";
import { HathoraYmlDefinition } from "./HathoraTypes";

export const IssuesContext: React.Context<ZodIssue[]> = createContext<ZodIssue[]>([]);

export const filterIssues = (issues: ZodIssue[], pathStartsWith: string): ZodIssue[] => {
    return issues.filter(issue => issue.path.length > 0 && issue.path[0] === pathStartsWith);
};

export const updateTypeNamesInConfig = (config: HathoraYmlDefinition, prevTypeName: string, newTypeName: string): HathoraYmlDefinition => {
    const newConfig = cloneDeep(config);

    forEach(newConfig.types, type => {
        if (type.type === "Alias") {
            if (get(config, ["typeDescription", "type"]) === prevTypeName) {
                set(newConfig, ["typeDescription", "type"], newTypeName);
            }
        }
    });

    return newConfig;
};
