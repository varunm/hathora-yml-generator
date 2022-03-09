import {
    Checkbox,
    Editable,
    EditableInput,
    EditablePreview,
    FormControl,
    FormErrorMessage,
    FormLabel,
    Heading,
    HStack,
    VStack,
} from "@chakra-ui/react";
import { isEmpty } from "lodash";
import React from "react";
import { Auth } from "../../HathoraTypes";

interface IAuthSectionProps {
    auth: Auth;
    setAuth: (auth: Auth) => void;
}

export function AuthSection({ auth, setAuth }: IAuthSectionProps) {

    const onSubmitAnonymous = (nextValue: string) => {
        setAuth({
            ...auth,
            anonymous: {
                separator: nextValue,
            },
        });
    };

    const onAnonymousToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            setAuth({
                ...auth,
                anonymous: {
                    separator: "",
                },
            });
        } else {
            setAuth({
                ...auth,
                anonymous: undefined,
            });
        }
    };

    const onSubmitGoogle = (nextValue: string) => {
        setAuth({
            ...auth,
            google: {
                clientId: nextValue,
            },
        });
    };

    const onGoogleToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            setAuth({
                ...auth,
                google: {
                    clientId: "",
                },
            });
        } else {
            setAuth({
                ...auth,
                google: undefined,
            });
        }
    };

    const formHasError = () => {
        const parsed = Auth.safeParse(auth);
        if (!parsed.success) {
            return parsed.error.issues[0].message;
        }
        return "";
    };

    return (
        <VStack align='flex-start' width='100%'>
            <FormControl id="main-form" isInvalid={isEmpty(formHasError)}>
                <Heading size='md'>Auth</Heading>
                <VStack align='flex-start'>
                    <VStack align='flex-start' backgroundColor='gray.100' width='100%'>
                        <HStack>
                            <Heading size='sm'>Anonymous</Heading>
                            <Checkbox onChange={onAnonymousToggle}>Enabled</Checkbox>
                        </HStack>

                        <FormControl id="separator" isDisabled={isEmpty(auth.anonymous)}>
                            <FormLabel fontWeight='semibold'>separator</FormLabel>
                            <Editable
                                defaultValue={auth.anonymous?.separator}
                                placeholder="placeholder"
                                isDisabled={isEmpty(auth.anonymous)}
                                onSubmit={onSubmitAnonymous}
                            >
                                <EditablePreview />
                                <EditableInput />
                            </Editable>
                        </FormControl>
                    </VStack>
                    <VStack align='flex-start' backgroundColor='gray.100' width='100%'>
                        <HStack>
                            <Heading size='sm'>Google</Heading>
                            <Checkbox onChange={onGoogleToggle}>Enabled</Checkbox>
                        </HStack>

                        <FormControl id="clientId" isDisabled={isEmpty(auth.google)} isInvalid={!isEmpty(auth.google) && isEmpty(auth.google?.clientId)}>
                            <FormLabel fontWeight='semibold'>clientId</FormLabel>
                            <Editable
                                defaultValue={auth.google?.clientId}
                                placeholder="placeholder"
                                isDisabled={isEmpty(auth.google)}
                                onSubmit={onSubmitGoogle}
                            >
                                <EditablePreview />
                                <EditableInput />
                            </Editable>
                            <FormErrorMessage>clientId required</FormErrorMessage>
                        </FormControl>
                    </VStack>
                </VStack>
                <FormErrorMessage>{formHasError()}</FormErrorMessage>
            </FormControl>
        </VStack>
    );
}
