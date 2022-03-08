import { FormControl, FormErrorMessage, Heading, HStack } from "@chakra-ui/react";
import { isEmpty } from "lodash";
import React from "react";
import { TypeSelector } from "../TypeSelector";

interface IErrorSectionProps {
    errorType: string;
    setErrorType: (errorType: string) => void;
    availableTypes: string[];
}

export function ErrorSection({
    errorType, setErrorType, availableTypes,
}: IErrorSectionProps) {

    const onSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setErrorType(event.target.value);
    };

    return (
        <HStack width='100%'>
            <Heading size='md'>Error</Heading>
            <FormControl isInvalid={isEmpty(errorType)}>
                <HStack>
                    <TypeSelector onChange={onSelect} selectedValue={errorType} availableTypes={availableTypes}/>
                    <FormErrorMessage width='100%'>Pick a value!</FormErrorMessage>
                </HStack>
            </FormControl>
        </HStack>
    );
}
