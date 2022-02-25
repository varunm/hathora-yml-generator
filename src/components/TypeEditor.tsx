import { Flex } from "@chakra-ui/react";
import yaml from "js-yaml";
import React, { useState } from "react";
import { YMLViewer } from "./YMLViewer";

class PropertyDefinition {
    type: string;
    isArray: boolean;
    isRequired: boolean;
      
    constructor(type: string, isArray: boolean, isRequired: boolean) {
        this.type = type;
        this.isArray = isArray;
        this.isRequired = isRequired;
    }
  
    toJSON() {
        return this.type + (this.isArray ? "[]" : "") + (this.isRequired ? "" : "?");
    }
}

type AliasDefinition = string;

type EnumDefinition = string[];

type UnionDefinition = string[];

type ObjectDefinition = {[name: string]: string};

type TypeDefinition = AliasDefinition | ObjectDefinition | EnumDefinition | UnionDefinition;

interface MethodDefinition {
    name: string;
    parameters: PropertyDefinition[];
}

interface HathoraYmlDefinition {
    types: {[name: string]: TypeDefinition};
    methods: MethodDefinition[];
    userState: string;
    initialize: string;
    error: string;
}

export function TypeEditor() {
    const [config, setConfig] = useState<HathoraYmlDefinition>({
        types: {
            "MyAlias": new PropertyDefinition("string", true, false).toJSON(),
            "UserState": {
                "id": "UserId",
            },
            "MyUnion": ["UserState", "AnotherState"],
            "MyEnum": ["VAL_1", "VAL_2"],
        },
        methods: [],
        userState: "UserState",
        initialize: "initMethod",
        error: "string",
    });

    console.log(yaml.dump(config));
    return (
        <Flex justifyContent='space-around'>
            <Flex width='50%'>FORM</Flex>
            <YMLViewer content={yaml.dump(config)}/>
        </Flex>);
}
