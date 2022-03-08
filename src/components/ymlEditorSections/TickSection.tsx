import {
    Checkbox,
    FormControl,
    Heading,
    HStack,
    NumberDecrementStepper,
    NumberIncrementStepper,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
} from "@chakra-ui/react";
import { isUndefined } from "lodash";
import React from "react";

interface ITickSectionProps {
    tick: number | undefined;
    setTick: (tick: number | undefined) => void;
}

export function TickSection({ tick, setTick }: ITickSectionProps) {
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
            <FormControl>
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
            </FormControl>
        </HStack>
    );
}
