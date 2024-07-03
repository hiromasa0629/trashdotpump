import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  HStack,
} from "@chakra-ui/react";

const Header = () => {
  return (
    <Container maxW={"100%"} h={"100%"}>
      <Flex justifyContent={"space-between"} alignItems={"center"} h={"100%"}>
        <Box>
          <Heading>Trash.pump</Heading>
        </Box>
        <Box>
          <HStack>
            <Box>
              <Button
                fontWeight={"900"}
                color={"indigo5"}
                bgColor={"unset"}
                _hover={{ bgColor: "unset" }}
              >
                Create
              </Button>
            </Box>
            <Box>
              <Button colorScheme="pink" fontWeight={"900"}>
                Connect Wallet
              </Button>
            </Box>
          </HStack>
        </Box>
      </Flex>
    </Container>
  );
};

export default Header;
