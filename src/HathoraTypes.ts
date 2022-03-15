import {
    forEach,
    isEmpty,
    isEqual,
    map,
    uniq,
} from "lodash";
import { z } from "zod";
import { PRIMITIVES } from "./constants";

export const TypeDescription = z.object({
    type: z.string().nonempty(),
    isArray: z.boolean().optional(),
    isOptional: z.boolean().optional(),
});

export const BaseType = z.object({
    name: z.string().nonempty().regex(/(^[A-Z][a-z]+)(([A-Z][a-z]+))*([A-Z])?/, "UpperCamelCase"),
});

export const AliasType = BaseType.extend({
    type: z.literal("Alias"),
    typeDescription: TypeDescription,
});

export const EnumType = BaseType.extend({
    type: z.literal("Enum"),
    enums: z.array(z.string()
        .nonempty("Value must not be empty")
        .regex(/^[A-Z0-9]+(?:_[A-Z0-9]+)*$/, "CAPITAL_UNDERSCORE_CASE_ONLY_1 please")),
});

export const UnionType = BaseType.extend({
    type: z.literal("Union"),
    unions: z.array(z.string()),
});

export const ObjectType = BaseType.extend({
    type: z.literal("Object"),
    fields: z.record(TypeDescription),
});

export const TypeDefinition = z.discriminatedUnion("type", [AliasType, EnumType, UnionType, ObjectType]);

export const MethodDefinition = z.object({
    name: z.string().regex(/(^[a-z]+)(([A-Z][a-z]+))*([A-Z])?/, "lowerCamelCase"),
    fields: z.record(TypeDescription),
});

export const AuthAnonymous = z
    .object({
        separator: z.string().optional(),
    }).strict();

export const AuthGoogle = z
    .object({
        clientId: z.string().nonempty(),
    }).strict();

export const Auth = z
    .object({
        anonymous: AuthAnonymous,
        google: AuthGoogle,
    })
    .partial()
    .refine(
        data => !isEmpty(data.anonymous) || !isEmpty(data.google),
        "At least one type of auth must be enabled"
    );

export type TypeDescription = z.infer<typeof TypeDescription>;
export type AliasType = z.infer<typeof AliasType>;
export type EnumType = z.infer<typeof EnumType>;
export type UnionType = z.infer<typeof UnionType>;
export type ObjectType = z.infer<typeof ObjectType>;
export type TypeDefinition = z.infer<typeof TypeDefinition>;
export type MethodDefinition = z.infer<typeof MethodDefinition>;
export type AuthAnonymous = z.infer<typeof AuthAnonymous>;
export type AuthGoogle = z.infer<typeof AuthGoogle>;
export type Auth = z.infer<typeof Auth>;

export const HathoraYmlDefinition = z.object({
    types: z.record(TypeDefinition),
    methods: z.record(MethodDefinition),
    userState: z.string(),
    error: z.string(),
    tick: z.optional(z.number().int().gte(50)),
    auth: Auth,
}).strict().superRefine((config, ctx) => {
    const availableTypes: string[] = getAvailableTypesFromConfig(config);

    // Check types are valid in method fields
    forEach(config.methods, method => {
        forEach(method.fields, (field, fieldName) => {
            if (!availableTypes.includes(field.type)) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "Type does not exist",
                    path: ["methods", method.name, "fields", fieldName, "type"],
                });
            }
        });
    });

    // Check types are valid in type fields
    forEach(config.types, type => {
        const filteredTypes = availableTypes.filter(typeName => typeName !== type.name);
        if ((type.type === "Alias") && (!filteredTypes.includes(type.typeDescription.type))){
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Type does not exist",
                path: ["types", type.name, "typeDescription", "type"],
            });
        }

        if (type.type === "Union") {
            const invalidTypes = type.unions.filter(union => !filteredTypes.includes(union));
            if (!isEmpty(invalidTypes)) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: `The following types do not exist: ${invalidTypes}`,
                    path: ["types", type.name, "unions"],
                });
            }

            // Check for duplicates
            if (!isEqual(uniq(type.unions), type.unions)) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "Duplicate types are not allowed",
                    path: ["types", type.name, "unions"],
                });
            }
        }

        if (type.type === "Object") {
            forEach(type.fields, (field, fieldName) => {
                if (field.type === type.name) {
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        message: "Recursive types not allowed",
                        path: ["types", type.name, "fields", fieldName, "type"],
                    });
                }
                if (!availableTypes.includes(field.type)) {
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        message: "Type does not exist",
                        path: ["types", type.name, "fields", fieldName, "type"],
                    });
                }
            });
        }

        if (type.type === "Enum") {
            // Check for duplicates
            if (!isEqual(uniq(type.enums), type.enums)) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "Duplicate values are not allowed",
                    path: ["types", type.name, "enums"],
                });
            }
        }
    });

    // Check types are valid in user state
    if (!availableTypes.includes(config.userState)) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Type does not exist",
            path: ["userState"],
        });
    }

    // Check types are valid in error
    if (!availableTypes.includes(config.error)) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Type does not exist",
            path: ["error"],
        });
    }
});

export type HathoraYmlDefinition = z.infer<typeof HathoraYmlDefinition>;

const getAvailableTypesFromConfig = (config: HathoraYmlDefinition) => {
    const availableTypes = map(config.types, type => type.name);
    const primitives: string[] = Object.values(PRIMITIVES).map((value) => (value as string ));
    return primitives.concat(availableTypes ?? []);
};
