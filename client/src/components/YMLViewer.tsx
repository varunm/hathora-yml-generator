import { Button, Flex } from "@chakra-ui/react";
import yaml from "js-yaml";
import { mapValues } from "lodash";
import React from "react";
import SyntaxHighlighter from "react-syntax-highlighter";
import { HathoraYmlDefinition, MethodDefinition, TypeDefinition, TypeDescription } from "../HathoraTypes";

const toStringTypeDescription = (typeDescription: TypeDescription) => {
    return typeDescription.type + (typeDescription.isArray ? "[]" : "") + (typeDescription.isOptional ? "?" : "");
};

const toString = (definition: TypeDefinition) => {
    if (definition.type === "Alias") {
        return toStringTypeDescription(definition.typeDescription);
    }
    if (definition.type === "Enum") {
        return definition.enums;
    }
    if (definition.type === "Union") {
        return definition.unions;
    }
    if (definition.type === "Object") {
        return mapValues(definition.fields, value => toStringTypeDescription(value));
    }
};

const toStringMethod = (method: MethodDefinition) => {
    return mapValues(method.fields, parameter => toStringTypeDescription(parameter));
};

interface IYMLViewerProps {
    config: HathoraYmlDefinition;
}

export function YMLViewer({ config }: IYMLViewerProps) {
    const stringifiedConfig = {
        ...config,
        types: mapValues(config.types, type => toString(type)),
        methods: mapValues(config.methods, method => toStringMethod(method)),
    };

    const onSave = () => {
        const requestOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                yaml: yaml.dump(stringifiedConfig),
            }),
        };
        fetch("http://localhost:5000/save", requestOptions);
    };

    return (
        <Flex display='contents' width='50%'>
            <SyntaxHighlighter language="yaml">
                {yaml.dump(stringifiedConfig)}
            </SyntaxHighlighter>
            <Button onClick={onSave}>Save</Button>
        </Flex>
    );
}
