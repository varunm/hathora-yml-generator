import { AddIcon } from "@chakra-ui/icons";
import { IconButton } from "@chakra-ui/react";
import React from "react";

interface IAddIconButtonProps {
    onClick: () => void;
}

export function AddIconButton({ onClick }: IAddIconButtonProps) {
    return (
        <IconButton
            size='xs'
            colorScheme='blue'
            aria-label='add'
            onClick={onClick}
            icon={<AddIcon />}
        />
    );
}
