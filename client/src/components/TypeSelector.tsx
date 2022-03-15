import { Select } from "@chakra-ui/react";
import { map } from "lodash";
import React from "react";
import { PRIMITIVES } from "../constants";

interface ITypeSelectorProps {
    onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
    selectedValue?: string;
    availableTypes: string[];
}

export function TypeSelector({
    onChange, selectedValue, availableTypes,
}: ITypeSelectorProps) {
    const primitives: string[] = Object.values(PRIMITIVES).map((value) => (value as string ));
    const allAvailableTypes: string[] = primitives.concat(availableTypes ?? []);
    return (
        <Select size='sm' placeholder='Select option' onChange={onChange} value={selectedValue}>
            {map(allAvailableTypes, value => <option key={value} value={value}>{value}</option>)}
        </Select>
    );
}
