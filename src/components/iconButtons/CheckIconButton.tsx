import { CheckIcon } from "@chakra-ui/icons";
import { IconButton } from "@chakra-ui/react";
import React from "react";

interface ICheckIconButtonProps {
    onClick: () => void;
}

export function CheckIconButton({ onClick }: ICheckIconButtonProps) {
    return (
        <IconButton
            size='xs'
            colorScheme='blue'
            aria-label='Check'
            onClick={onClick}
            icon={<CheckIcon />}
        />
    );
}
