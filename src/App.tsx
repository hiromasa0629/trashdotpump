import { Box, Container, Flex, Grid, GridItem, VStack } from "@chakra-ui/react";
import Header from "./Components/Header";
import TrashList from "./Components/TrashList";
import Trash from "./Components/Trash";
import TrashTitle from "./Components/TrashTitle";

function App() {
  return (
    <>
      <Container maxW={"container.root"} py={2} h={"100vh"} overflow={"hidden"}>
        <Grid
          templateAreas={`"header header"
                  "nav main"`}
          gridTemplateRows={"70px 1fr"}
          gridTemplateColumns={"400px 1fr"}
          h="100%"
          gap={3}
          color="blackAlpha.700"
          fontWeight="bold"
          sx={{ color: "var(--chakra-colors-indigo5)" }}
        >
          <GridItem
            p="2"
            area={"header"}
            boxShadow={"var(--chakra-colors-indigo3) 0px 0px 7px"}
            borderRadius={10}
            // bgColor={"indigo"}
          >
            <Header />
          </GridItem>
          <GridItem
            p="2"
            area={"nav"}
            overflowY={"scroll"}
            boxShadow={"var(--chakra-colors-indigo3) 0px 0px 7px"}
            borderRadius={10}
            // bgColor={"indigo"}
          >
            <TrashList />
          </GridItem>
          <GridItem
            p="2"
            area={"main"}
            boxShadow={"var(--chakra-colors-indigo3) 0px 0px 7px"}
            borderRadius={10}
            // bgColor={"indigo"}
          >
            <VStack gap={3}>
              <Box h={70} w={"100%"}>
                <TrashTitle />
              </Box>
              <Trash />
            </VStack>
          </GridItem>
        </Grid>
      </Container>
    </>
  );
}

export default App;
