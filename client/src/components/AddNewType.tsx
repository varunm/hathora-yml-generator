import { AddIcon } from "@chakra-ui/icons";
import {
    Box,
    Button,
    FormControl,
    Heading,
    Input,
    Select,
} from "@chakra-ui/react";
import { map } from "lodash";
import React, { useState } from "react";
import { TypeDefinition } from "../HathoraTypes";

interface IAddNewTypeProps {
    addNewType: (newType: TypeDefinition) => void;
}

export function AddNewType({ addNewType }: IAddNewTypeProps) {
    const [newTypeName, setNewTypeName] = useState<string>("");
    const [newType, setNewType] = useState<string>("");

    const onNewTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setNewType(event.target.value);
    };

    const onNewTypeNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNewTypeName(event.target.value);
    };

    const newTypeAdded = () => {
        if (newType === "Alias") {
            addNewType({
                type: "Alias", name: newTypeName, typeDescription: {
                    type: "string",
                },
            });
        }

        if (newType === "Enum") {
            addNewType({
                type: "Enum", name: newTypeName, enums: [],
            });
        }

        if (newType === "Union") {
            addNewType({
                type: "Union", name: newTypeName, unions: [],
            });
        }

        if (newType === "Object") {
            addNewType({
                type: "Object", name: newTypeName, fields: {},
            });
        }

        setNewType("");
        setNewTypeName("");
    };

    return (
        <Box flexDirection='column'>
            <Heading size='sm'>Add New Type</Heading>
            <FormControl>
                <Input value={newTypeName} onChange={onNewTypeNameChange} placeholder="Name of new type" />
            </FormControl>
            <FormControl>
                <Select value={newType} onChange={onNewTypeChange} placeholder='Select type'>
                    {map(["Alias", "Enum", "Union", "Object"], value => <option key={value} value={value}>{value}</option>)}
                </Select>
            </FormControl>
            <Button onClick={newTypeAdded} rightIcon={<AddIcon />} colorScheme='teal' variant='outline'>
                Add
            </Button>
        </Box>
    );
}
