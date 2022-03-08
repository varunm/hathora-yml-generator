import { isEmpty } from "lodash";
import { z } from "zod";

export const TypeDescription = z.object({
    type: z.string().regex(/(^[a-z]+)(([A-Z][a-z]+))*([A-Z])?/, "lowerCamelCase"),
    isArray: z.boolean().optional(),
    isOptional: z.boolean().optional(),
});

export const BaseType = z.object({
    name: z.string().regex(/(^[A-Z][a-z]+)(([A-Z][a-z]+))*([A-Z])?/, "UpperCamelCase"),
});

export const AliasType = BaseType.extend({
    type: z.literal("Alias"),
    typeDescription: TypeDescription,
});

export const EnumValueType = z.string()
    .nonempty("Value must not be empty")
    .regex(/^[A-Z0-9]+(?:_[A-Z0-9]+)*$/, "CAPITAL_UNDERSCORE_CASE_ONLY_1 please");

export const EnumType = BaseType.extend({
    type: z.literal("Enum"),
    enums: z.array(EnumValueType),
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
        separator: z.string(),
    }).strict();

export const AuthGoogle = z
    .object({
        clientId: z.string(),
    }).strict();

export const Auth = z
    .object({
        anonymous: AuthAnonymous,
        google: AuthGoogle,
    })
    .partial()
    .refine(
        data => !isEmpty(data.anonymous) || !isEmpty(data.google),
        "Some type of auth must be defined"
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
}).strict();

export type HathoraYmlDefinition = z.infer<typeof HathoraYmlDefinition>;
