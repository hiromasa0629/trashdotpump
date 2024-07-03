import {
  Box,
  Flex,
  Image,
  List,
  ListItem,
  Stat,
  StatArrow,
  StatHelpText,
  StatLabel,
  StatNumber,
  Text,
} from "@chakra-ui/react";
import trashes from "../data/trashes.json";

const TrashList = () => {
  return (
    <List spacing={3}>
      {trashes.map((v) => (
        <ListItem>
          <Trash {...v} />
        </ListItem>
      ))}
      {trashes.map((v) => (
        <ListItem>
          <Trash {...v} />
        </ListItem>
      ))}
    </List>
  );
};

export default TrashList;

type TrashType = {
  name: string;
  price: number;
  change: number;
  image: string;
};

const Trash = (props: TrashType) => {
  const { name, price, change, image } = props;

  return (
    <Flex
      gap={1}
      alignItems={"center"}
      _hover={{ bgColor: "var(--chakra-colors-indigo)", cursor: "pointer" }}
      borderRadius={10}
    >
      <Box w={"20%"}>
        <Image
          src={`/assets/${image}`}
          objectFit={"contain"}
          borderRadius={"full"}
        />
      </Box>
      <Box flex={1}>
        <Stat>
          <StatLabel>{name}</StatLabel>
          <StatNumber>RM {price}</StatNumber>
        </Stat>
      </Box>
      <Box w={"35%"} textAlign={"right"}>
        <Stat>
          <StatHelpText fontSize={"large"} m={0}>
            <StatArrow type={change > 0 ? "increase" : "decrease"} />
            {change}%
          </StatHelpText>
        </Stat>
      </Box>
    </Flex>
  );
};
