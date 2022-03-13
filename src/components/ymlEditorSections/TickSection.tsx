import {
    Checkbox,
    FormControl,
    FormErrorMessage,
    Heading,
    HStack,
    NumberDecrementStepper,
    NumberIncrementStepper,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
} from "@chakra-ui/react";
import { isEmpty, isEqual, isUndefined } from "lodash";
import React, { useContext } from "react";
import { ZodIssue } from "zod";
import { IssuesContext } from "../../util";

interface ITickSectionProps {
    tick: number | undefined;
    setTick: (tick: number | undefined) => void;
}

export function TickSection({ tick, setTick }: ITickSectionProps) {
    const issues: ZodIssue[] = useContext(IssuesContext).filter(
        issue => isEqual(issue.path, ["tick"])
    );

    const onCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            setTick(50);
        } else {
            setTick(undefined);
        }
    };

    const onInputChange = (_valueAsString: string, valueAsNumber: number) => {
        setTick(valueAsNumber);
    };

    return (
        <HStack width='100%'>
            <Heading size='md'>Tick</Heading>
            <FormControl isInvalid={!isEmpty(issues)}>
                <HStack>
                    <NumberInput onChange={onInputChange} isDisabled={isUndefined(tick)} value={tick} min={50}>
                        <NumberInputField />
                        <NumberInputStepper>
                            <NumberIncrementStepper />
                            <NumberDecrementStepper />
                        </NumberInputStepper>
                    </NumberInput>
                    <Checkbox isChecked={!isUndefined(tick)} onChange={onCheckboxChange}>Enabled</Checkbox>
                </HStack>
                <FormErrorMessage>{isEmpty(issues) ? "" : issues[0].message}</FormErrorMessage>
            </FormControl>
        </HStack>
    );
}
