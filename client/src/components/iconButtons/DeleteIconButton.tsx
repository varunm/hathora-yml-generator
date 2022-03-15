import { DeleteIcon } from "@chakra-ui/icons";
import { IconButton } from "@chakra-ui/react";
import React from "react";

interface IDeleteIconButtonProps {
    onClick: () => void;
}

export function DeleteIconButton({ onClick }: IDeleteIconButtonProps) {
    return (
        <IconButton
            size='sm'
            colorScheme='red'
            aria-label='delete'
            fontSize='18px'
            onClick={onClick}
            icon={<DeleteIcon />}
        />
    );
}
