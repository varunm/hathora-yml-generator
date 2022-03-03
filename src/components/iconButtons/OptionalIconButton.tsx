import { IconButton, Tooltip } from "@chakra-ui/react";
import React from "react";
import { RiQuestionMark } from "react-icons/ri";

interface IOptionalIconButtonProps {
    isSelected?: boolean;
    onClick: () => void;
}

export function OptionalIconButton({ isSelected, onClick }: IOptionalIconButtonProps) {
    return (
        <Tooltip label="Convert to optional" placement="top" openDelay={200}>
            <IconButton
                size='sm'
                variant={isSelected ? "solid" : "outline"}
                colorScheme='teal'
                aria-label='isOptional'
                fontSize='18px'
                onClick={onClick}
                icon={<RiQuestionMark />}
            />
        </Tooltip>
    );
}
