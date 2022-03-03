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
export type TypeDescription = z.infer<typeof TypeDescription>;
export type AliasType = z.infer<typeof AliasType>;
export type EnumType = z.infer<typeof EnumType>;
export type UnionType = z.infer<typeof UnionType>;
export type ObjectType = z.infer<typeof ObjectType>;
export type TypeDefinition = z.infer<typeof TypeDefinition>;
