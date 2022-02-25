import { Flex } from "@chakra-ui/react";
import React from "react";
import SyntaxHighlighter from "react-syntax-highlighter";

interface IYMLViewerProps {
    content: string;
}

export function YMLViewer({ content }: IYMLViewerProps) {
    return (
        <Flex display='contents' width='50%'>
            <SyntaxHighlighter language="yaml">
                {content}
            </SyntaxHighlighter>
        </Flex>
    );
}
