import { FormControl, FormErrorMessage, Heading, HStack } from "@chakra-ui/react";
import { isEmpty, isEqual } from "lodash";
import React, { useContext } from "react";
import { ZodIssue } from "zod";
import { IssuesContext } from "../../util";
import { TypeSelector } from "../TypeSelector";

interface IErrorSectionProps {
    error: string;
    setError: (error: string) => void;
    availableTypes: string[];
}

export function ErrorSection({
    error, setError, availableTypes,
}: IErrorSectionProps) {
    const issues: ZodIssue[] = useContext(IssuesContext).filter(
        issue => isEqual(issue.path, ["error"])
    );

    const onSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setError(event.target.value);
    };

    return (
        <HStack width='100%'>
            <Heading size='md'>Error</Heading>
            <FormControl isInvalid={!isEmpty(issues)}>
                <HStack>
                    <TypeSelector onChange={onSelect} selectedValue={error} availableTypes={availableTypes}/>
                </HStack>
                <FormErrorMessage>{isEmpty(issues) ? "" : issues[0].message}</FormErrorMessage>
            </FormControl>
        </HStack>
    );
}
