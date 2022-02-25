import { Flex } from "@chakra-ui/react";
import yaml from "js-yaml";
import React from "react";
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
    const test: HathoraYmlDefinition = {
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
    };

    console.log(yaml.dump(test));
    return (
        <Flex justifyContent='space-around'>
            <div>FORM</div>
            <YMLViewer content={yaml.dump(test)}/>
        </Flex>);
}
