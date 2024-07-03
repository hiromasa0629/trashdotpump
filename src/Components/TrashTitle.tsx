import {
  Box,
  Flex,
  Heading,
  Image,
  Stat,
  StatArrow,
  StatHelpText,
  Text,
  VStack,
} from "@chakra-ui/react";

const TrashTitle = () => {
  return (
    <Flex gap={1} alignItems={"center"} h={"100%"}>
      <Box h={"100%"}>
        <Image
          src={`/assets/paper_cup.jpeg`}
          objectFit={"contain"}
          borderRadius={"full"}
          h={"100%"}
        />
      </Box>
      <Box flex={1}>
        <VStack alignItems={"start"}>
          <Box>
            <Heading>Paper Cup</Heading>
          </Box>
          <Box>
            <Text as={"span"}>
              CA: EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm
            </Text>
          </Box>
        </VStack>
      </Box>
      <Box w={"25%"} textAlign={"end"}>
        <Stat>
          <StatHelpText fontSize={"xx-large"} m={0}>
            <StatArrow type={"increase"} />
            15.71%
          </StatHelpText>
        </Stat>
      </Box>
    </Flex>
  );
};

export default TrashTitle;
