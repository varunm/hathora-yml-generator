import { createContext } from "react";
import { ZodIssue } from "zod";

export const IssuesContext: React.Context<ZodIssue[]> = createContext<ZodIssue[]>([]);

export const filterIssues = (issues: ZodIssue[], pathStartsWith: string): ZodIssue[] => {
    return issues.filter(issue => issue.path.length > 0 && issue.path[0] === pathStartsWith);
};
