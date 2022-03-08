import { FormControl, FormErrorMessage, Heading, HStack } from "@chakra-ui/react";
import { isEmpty } from "lodash";
import React from "react";
import { TypeSelector } from "../TypeSelector";

interface IUserStateSectionProps {
    userState: string;
    setUserState: (methods: string) => void;
    availableTypes: string[];
}

export function UserStateSection({
    userState, setUserState, availableTypes,
}: IUserStateSectionProps) {

    const onSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setUserState(event.target.value);
    };

    return (
        <HStack width='100%'>
            <Heading size='md'>UserState</Heading>
            <FormControl isInvalid={isEmpty(userState)}>
                <HStack>
                    <TypeSelector onChange={onSelect} selectedValue={userState} availableTypes={availableTypes}/>
                    <FormErrorMessage width='100%'>Pick a value!</FormErrorMessage>
                </HStack>
            </FormControl>
        </HStack>
    );
}
