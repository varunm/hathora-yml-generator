import { z } from "zod";

export const TypeDescription = z.object({
    type: z.string(),
    isArray: z.boolean().optional(),
    isOptional: z.boolean().optional(),
});

export const BaseType = z.object({
    name: z.string(),
});

export const AliasType = BaseType.extend({
    type: z.literal("Alias"),
    typeDescription: TypeDescription,
});

export const EnumType = BaseType.extend({
    type: z.literal("Enum"),
    enums: z.array(z.string()),
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
