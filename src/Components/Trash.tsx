import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  HStack,
  IconButton,
  Input,
  NumberInput,
  NumberInputField,
  Text,
  VStack,
} from "@chakra-ui/react";
import Chart from "./Chart";
import { LuArrowRightLeft } from "react-icons/lu";

const initialData = [
  { open: 10, high: 10.63, low: 9.49, close: 9.55, time: "2024-06-29" },
  { open: 9.55, high: 10.3, low: 9.42, close: 9.94, time: "2024-06-30" },
  { open: 9.94, high: 10.17, low: 9.92, close: 9.78, time: "2024-07-01" },
  { open: 9.78, high: 10.59, low: 9.18, close: 9.51, time: "2024-07-02" },
  { open: 9.51, high: 10.46, low: 9.1, close: 10.17, time: "2024-07-03" },
  { open: 10.17, high: 10.96, low: 10.16, close: 10.47, time: "2024-07-04" },
  { open: 10.47, high: 11.39, low: 10.4, close: 10.81, time: "2024-07-05" },
  { open: 10.81, high: 11.6, low: 10.3, close: 10.75, time: "2024-07-06" },
  { open: 10.75, high: 11.6, low: 10.49, close: 10.93, time: "2024-07-07" },
  { open: 10.93, high: 11.53, low: 10.76, close: 10.96, time: "2024-07-08" },
];

const Trash = () => {
  return (
    <VStack gap={2} w={"100%"}>
      <Flex w={"100%"}>
        <Chart data={initialData} />
      </Flex>
      <VStack w={"100%"}>
        <Flex
          justifyContent={"space-between"}
          alignItems={"center"}
          w={"75%"}
          gap={3}
        >
          <VStack alignItems={"start"} gap={0} flex={1}>
            <HStack justifyContent={"space-between"} w={"100%"}>
              <Box textAlign={"left"} w={"100%"}>
                <Text>From</Text>
              </Box>
              <Box textAlign={"left"} w={"100%"}>
                <Text>Balance: 147</Text>
              </Box>
            </HStack>
            <NumberInput w={"100%"}>
              <NumberInputField />
            </NumberInput>
          </VStack>
          <IconButton
            aria-label="Switch"
            isRound={true}
            icon={<LuArrowRightLeft />}
            alignSelf={"end"}
            mb={1}
            size={"sm"}
          />
          <VStack alignItems={"start"} gap={0} flex={1}>
            <HStack justifyContent={"space-between"} w={"100%"}>
              <Box textAlign={"left"} w={"100%"}>
                <Text>To</Text>
              </Box>
              <Box textAlign={"left"} w={"100%"}>
                <Text>Balance: 147</Text>
              </Box>
            </HStack>
            <NumberInput w={"100%"}>
              <NumberInputField />
            </NumberInput>
          </VStack>
        </Flex>
        <Flex justifyContent={"center"}>
          <Button w={400} colorScheme="pink">
            Swap
          </Button>
        </Flex>
      </VStack>
    </VStack>
  );
};

export default Trash;
