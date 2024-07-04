import {
  Box,
  Divider,
  Flex,
  Heading,
  Image,
  Stat,
  StatArrow,
  StatHelpText,
  Text,
  VStack,
} from "@chakra-ui/react";

interface TrashTitleProps {
  lpSolBalance: number;
}

const TrashTitle = (props: TrashTitleProps) => {
  const { lpSolBalance } = props;

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
        <VStack alignItems={"start"} gap={0}>
          <Box>
            <Heading>Paper Cup (PC)</Heading>
          </Box>
          <Flex alignItems={"center"}>
            <Text as={"span"}>Max cap (SOL): 10</Text>
            <Divider orientation="vertical" color={"indigo5"} h={4} mx={2} />
            <Text as={"span"}>Raised (SOL): {lpSolBalance}</Text>
          </Flex>
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
