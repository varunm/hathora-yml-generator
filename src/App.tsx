import { ChakraProvider, Container } from "@chakra-ui/react";
import React from "react";
import "./App.css";
import { Header } from "./components/Header";
import { TypeEditor } from "./components/TypeEditor";

function App() {
    // const [count, setCount] = useState(0);

    return (
        <ChakraProvider>
            <Container maxWidth='container.xl'>
                <Header />
                <TypeEditor />
            </Container>
        </ChakraProvider>
    );
}

export default App;
