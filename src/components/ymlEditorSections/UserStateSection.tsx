import { FormControl, FormErrorMessage, Heading, HStack } from "@chakra-ui/react";
import { isEmpty, isEqual } from "lodash";
import React, { useContext } from "react";
import { ZodIssue } from "zod";
import { IssuesContext } from "../../util";
import { TypeSelector } from "../TypeSelector";

interface IUserStateSectionProps {
    userState: string;
    setUserState: (methods: string) => void;
    availableTypes: string[];
}

export function UserStateSection({
    userState, setUserState, availableTypes,
}: IUserStateSectionProps) {
    const issues: ZodIssue[] = useContext(IssuesContext).filter(
        issue => isEqual(issue.path, ["userState"])
    );

    const onSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setUserState(event.target.value);
    };

    return (
        <HStack width='100%'>
            <Heading size='md'>UserState</Heading>
            <FormControl isInvalid={!isEmpty(issues)}>
                <HStack>
                    <TypeSelector onChange={onSelect} selectedValue={userState} availableTypes={availableTypes}/>
                </HStack>
                <FormErrorMessage>{isEmpty(issues) ? "" : issues[0].message}</FormErrorMessage>
            </FormControl>
        </HStack>
    );
}
