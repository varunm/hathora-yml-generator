import { IconButton, Tooltip } from "@chakra-ui/react";
import React from "react";
import { VscSymbolArray } from "react-icons/vsc";

interface IArrayIconButtonProps {
    isSelected?: boolean;
    onClick: () => void;
}

export function ArrayIconButton({ isSelected, onClick }: IArrayIconButtonProps) {
    return (
        <Tooltip label="Convert to array" placement="top" openDelay={200}>
            <IconButton
                size='sm'
                variant={isSelected ? "solid" : "outline"}
                colorScheme='teal'
                aria-label='isArray'
                fontSize='18px'
                onClick={onClick}
                icon={<VscSymbolArray />}
            />
        </Tooltip>
    );
}
