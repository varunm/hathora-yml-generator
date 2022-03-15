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
import { difference, isEmpty, isEqual } from "lodash";
import React, { useContext } from "react";
import { ZodIssue } from "zod";
import { Auth } from "../../HathoraTypes";
import { IssuesContext } from "../../util";

interface IAuthSectionProps {
    auth: Auth;
    setAuth: (auth: Auth) => void;
}

export function AuthSection({ auth, setAuth }: IAuthSectionProps) {
    const issues: ZodIssue[] = useContext(IssuesContext);
    const authIssues = issues.filter(
        issue => isEqual(issue.path, ["auth"])
    );
    const anonymousAuthIssues = issues.filter(
        issue => difference(["auth", "anonymous"], issue.path).length === 0
    );
    const googleAuthIssues = issues.filter(
        issue => difference(["auth", "google"], issue.path).length === 0
    );

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

    return (
        <VStack align='flex-start' width='100%'>
            <FormControl id="main-form" isInvalid={!isEmpty(authIssues)}>
                <Heading size='md'>Auth</Heading>
                <VStack align='flex-start'>
                    <VStack align='flex-start' backgroundColor='gray.100' width='100%'>
                        <HStack>
                            <Heading size='sm'>Anonymous</Heading>
                            <Checkbox isChecked={!isEmpty(auth.anonymous)} onChange={onAnonymousToggle}>Enabled</Checkbox>
                        </HStack>

                        <FormControl id="separator" isDisabled={isEmpty(auth.anonymous)} isInvalid={!isEmpty(anonymousAuthIssues)}>
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
                            <FormErrorMessage>{isEmpty(anonymousAuthIssues) ? "" : anonymousAuthIssues[0].message}</FormErrorMessage>
                        </FormControl>
                    </VStack>
                    <VStack align='flex-start' backgroundColor='gray.100' width='100%'>
                        <HStack>
                            <Heading size='sm'>Google</Heading>
                            <Checkbox isChecked={!isEmpty(auth.google)} onChange={onGoogleToggle}>Enabled</Checkbox>
                        </HStack>

                        <FormControl id="clientId" isDisabled={isEmpty(auth.google)} isInvalid={!isEmpty(googleAuthIssues)}>
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
                            <FormErrorMessage>{isEmpty(googleAuthIssues) ? "" : googleAuthIssues[0].message}</FormErrorMessage>
                        </FormControl>
                    </VStack>
                </VStack>
                <FormErrorMessage>{isEmpty(authIssues) ? "" : authIssues[0].message}</FormErrorMessage>
            </FormControl>
        </VStack>
    );
}
