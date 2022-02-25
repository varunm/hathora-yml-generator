import { Flex } from "@chakra-ui/react";
import React from "react";

interface IYMLViewerProps {
    content: string;
}

export function YMLViewer({ content }: IYMLViewerProps) {
    return (
        <Flex>{content}</Flex>
    );
}
