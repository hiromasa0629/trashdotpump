import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  HStack,
  IconButton,
  Input,
  InputGroup,
  InputRightAddon,
  NumberInput,
  NumberInputField,
  Text,
  useToast,
  VStack,
} from "@chakra-ui/react";
import Chart from "./Chart";
import { LuArrowRightLeft } from "react-icons/lu";
import { useEffect, useState } from "react";
import {
  getEstimatedSolReceive,
  getEstimatedTokenReceive,
  getSolBal,
  getTokenBal,
} from "../lpFunctions/utils";
import { Connection, PublicKey } from "@solana/web3.js";
import TrashTitle from "./TrashTitle";
import mywallet from "../keypair.json";
import lpwallet from "../lpkeypair.json";
import { buyToken, sellToken } from "../lpFunctions/lp";
import initialData from "../data.json";

import { jupiterV6Swap, getQuote } from "../jupiterV6/jupiterV6";

const Trash = () => {
  const [connection, setConnection] = useState<Connection>();
  const [solBalance, setSolBalance] = useState(0);
  const [lpSolBalance, setLpSolBalance] = useState(0);
  const [tokenBalance, setTokenBalance] = useState(0);
  const [lpTokenBalance, setLpTokenBalance] = useState(0);
  const [priceImpact, setPriceImpact] = useState(0);
  const [priceImpactColor, setPriceImpactColor] = useState("rgb(72, 187, 120)");
  const [routePlan, setRoutePlan] = useState([]);
  const [tokenReceive, setTokenReceive] = useState(0);
  const [solReceive, setSolReceive] = useState(0);
  const [type, setType] = useState<"buy" | "sell">("buy");
  const [value, setValue] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<typeof initialData>([]);

  const toast = useToast({ position: "bottom-right" });

  useEffect(() => {
    setData(initialData);
  }, []);

  useEffect(() => {
    const conn = new Connection(
      "https://newest-dawn-borough.solana-mainnet.quiknode.pro/70aa5ca62456de58a913bd6510229c9756adbca2/"
    );
    setConnection(conn);
  }, []);

  useEffect(() => {
    if (!connection) return;
    getSolBal(mywallet.publicKey, connection).then((v) => {
      setSolBalance(v / 1e9)
    });
    getTokenBal(mywallet.publicKey, connection).then((v) => {
      setTokenBalance(v ? v / 1e6 : 0);
    });
    getSolBal(lpwallet.publicKey, connection).then((v) =>
      setLpSolBalance(v / 1e9)
    );
    getTokenBal(lpwallet.publicKey, connection).then((v) => {
      setLpTokenBalance(v ? v / 1e6 : 0);
    });
  }, [connection]);

  const setPriceImpactFunction = (value: string) => {
    let num = Number(value) * 100;
    console.log(num);
    if (num > 5 && num < 10) {
      setPriceImpactColor("orange");
    } else if (num > 10) {
      setPriceImpactColor("red");
    } else {
      setPriceImpactColor("rgb(72, 187, 120)");
    }
    setPriceImpact(num);
  };

  const handleSolChange = async (value: string) => {
    // const res = getEstimatedTokenReceive(Number(value), 10);

    try {
      let quote = await getQuote(
        "So11111111111111111111111111111111111111112",
        "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
        Number(value) * 10 ** 9,
        500,
        ""
      );
      setTokenReceive(quote.outAmount / 10 ** 6);
      setPriceImpactFunction(quote.priceImpactPct);

      const labels = quote.routePlan.map((item: any) => item.swapInfo.label);
      setRoutePlan(labels);

      console.log(quote);
    } catch (error) {
      console.error("Error fetching quote:", error);
    }
  };

  const handleTokenChange = async (value: string) => {
    // const res = getEstimatedSolReceive(Number(value), 10);

    try {
      let quote = await getQuote(
        "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
        "So11111111111111111111111111111111111111112",
        Number(value) * 10 ** 6,
        500,
        ""
      );
      setSolReceive(quote.outAmount / 10 ** 9);
      setPriceImpactFunction(quote.priceImpactPct);

      const labels = quote.routePlan.map((item: any) => item.swapInfo.label);
      setRoutePlan(labels);
      console.log(quote);
    } catch (error) {
      console.error("Error fetching quote:", error);
    }
  };

  const handleTypeChange = () => {
    if (type === "buy") {
      setType("sell");
      setSolReceive(Number(value));
      setValue(`${tokenReceive}`);
    } else {
      setType("buy");
      setTokenReceive(Number(value));
      setValue(`${solReceive}`);
    }
  };

  const handleValueChange = (value: string) => {
    setValue(value);
  };

  const handleBuy = async (connection: Connection) => {
    setIsLoading(true);
    const txHash = await buyToken(
      Number(value),
      connection,
      mywallet,
      lpwallet
    );
    setIsLoading(false);
    setSolBalance((prev) => prev - Number(value));
    setTokenBalance((prev) => prev + tokenReceive);
    // getSolBal(mywallet.publicKey, connection).then((v) =>
    //   setSolBalance(v / 1e9)
    // );
    // getTokenBal(mywallet.publicKey, connection).then((v) => {
    //   setTokenBalance(v ? v / 1e6 : 0);
    // });
    getSolBal(lpwallet.publicKey, connection).then((v) =>
      setLpSolBalance(v / 1e9)
    );
    getTokenBal(lpwallet.publicKey, connection).then((v) => {
      console.log(v / 1e6);
      setLpTokenBalance(v ? v / 1e6 : 0);
    });
    setData((prev) => {
      const last = prev[prev.length - 1];
      return [
        ...prev,
        {
          open: last.close,
          high: last.close * 1.05,
          close: last.close * 1.05,
          low: last.close,
          time: `${Number((last.time + "").split("-")[0]) + 1}-01-01`,
        },
      ];
    });
    return txHash;
  };

  const handleSell = async (connection: Connection) => {
    setIsLoading(true);
    const txHash = await sellToken(
      Number(value),
      connection,
      mywallet,
      lpwallet
    );
    setIsLoading(false);
    setIsLoading(false);
    setSolBalance((prev) => prev + solReceive);
    setTokenBalance((prev) => prev - Number(value));
    // getSolBal(mywallet.publicKey, connection).then((v) =>
    //   setSolBalance(v / 1e9)
    // );
    // getTokenBal(mywallet.publicKey, connection).then((v) => {
    //   setTokenBalance(v ? v / 1e6 : 0);
    // });
    getSolBal(lpwallet.publicKey, connection).then((v) =>
      setLpSolBalance(v / 1e9)
    );
    getTokenBal(lpwallet.publicKey, connection).then((v) => {
      console.log(v / 1e6);
      setLpTokenBalance(v ? v / 1e6 : 0);
    });
    setData((prev) => {
      const last = prev[prev.length - 1];
      return [
        ...prev,
        {
          open: last.close,
          high: last.close * 0.5,
          close: last.close * 0.5,
          low: last.close,
          time: `${Number((last.time + "").split("-")[0]) + 1}-01-01`,
        },
      ];
    });
    return txHash;
  };

  const handleSwap = async () => {
    if (!connection) return;
    if (type === "buy") {
      toast({
        status: "info",
        description: "Swapping...",
        duration: null,
        isClosable: true,
      });
      // const txHash = await handleBuy(connection);
      setIsLoading(true);
      let tx = await jupiterV6Swap(
        "So11111111111111111111111111111111111111112",
        "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
        0.0001 * 10 ** 9,
        500,
        "",
        10000,
        5000
      );
      setIsLoading(false);

      getSolBal(lpwallet.publicKey, connection).then((v) =>
        setLpSolBalance(v / 1e9)
      );
      getTokenBal(lpwallet.publicKey, connection).then((v) => {
        console.log(v / 1e6);
        setLpTokenBalance(v ? v / 1e6 : 0);
      });

      const txHash = tx;

      if (tx) {
        toast({
          status: "success",
          description: `Swapped successfully \n https://solscan.io/tx/${txHash}`,
          duration: null,
          isClosable: true,
        });
      } else {
        toast({
          status: "warning",
          description: `Swap failed !`,
          duration: null,
          isClosable: true,
        });
      }
      // toast.promise(handleBuy(connection), {
      //   success: { title: "Swapped successfully" },
      //   error: { title: "Promise rejected", description: "Something wrong" },
      //   loading: { title: "Swapping..." },
      // });
    } else if (type === "sell") {
      toast({
        status: "info",
        description: "Swapping...",
        duration: null,
        isClosable: true,
      });

      // const txHash = await handleSell(connection);
      setIsLoading(true);
      let tx = await jupiterV6Swap(
        "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
        "So11111111111111111111111111111111111111112",
        0.01 * 10 ** 6,
        500,
        "",
        10000,
        5000
      );
      setIsLoading(false);

      getSolBal(lpwallet.publicKey, connection).then((v) =>
        setLpSolBalance(v / 1e9)
      );
      getTokenBal(lpwallet.publicKey, connection).then((v) => {
        setLpTokenBalance(v ? v / 1e6 : 0);
      });

      const txHash = tx;

      if (tx) {
        toast({
          status: "success",
          description: `Swapped successfully \n https://solscan.io/tx/${txHash}`,
          duration: null,
          isClosable: true,
        });
      } else {
        toast({
          status: "warning",
          description: `Swap failed !`,
          duration: null,
          isClosable: true,
        });
      }
      // toast.promise(handleSell(connection), {
      //   success: { title: "Swapped successfully" },
      //   error: { title: "Promise rejected", description: "Something wrong" },
      //   loading: { title: "Swapping..." },
      // });
    }
  };

  return (
    <>
      <Box h={70} w={"100%"}>
        <TrashTitle lpSolBalance={lpSolBalance} />
      </Box>
      <VStack gap={2} w={"100%"}>
        <Flex w={"100%"}>
          <Chart data={data} />
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
                <Box textAlign={"left"}>
                  <Text>From</Text>
                </Box>
                <Box textAlign={"right"} flex={1}>
                  <Text>
                    Balance:{" "}
                    {(type === "buy"
                      ? solBalance
                      : tokenBalance
                    ).toLocaleString(undefined, { minimumFractionDigits: 5 })}
                  </Text>
                </Box>
              </HStack>
              <InputGroup>
                <Input
                  w={"100%"}
                  placeholder="Enter value"
                  onChange={(e) => {
                    if (type === "buy") handleSolChange(e.target.value);
                    else handleTokenChange(e.target.value);
                    handleValueChange(e.target.value);
                  }}
                  value={value}
                />
                <InputRightAddon color={"black"}>
                  {type === "buy" ? "SOL" : "PC"}
                </InputRightAddon>
              </InputGroup>
            </VStack>
            <IconButton
              aria-label="Switch"
              isRound={true}
              icon={<LuArrowRightLeft />}
              alignSelf={"end"}
              mb={1}
              size={"sm"}
              onClick={handleTypeChange}
            />
            <VStack alignItems={"start"} gap={0} flex={1}>
              <HStack justifyContent={"space-between"} w={"100%"}>
                <Box textAlign={"left"}>
                  <Text>To</Text>
                </Box>
                <Box textAlign={"right"} flex={1}>
                  <Text>
                    Balance:{" "}
                    {(type === "buy"
                      ? tokenBalance
                      : solBalance
                    ).toLocaleString(undefined, { minimumFractionDigits: 5 })}
                  </Text>
                </Box>
              </HStack>
              <InputGroup>
                <Input
                  w={"100%"}
                  value={type === "buy" ? tokenReceive : solReceive}
                  disabled={true}
                  sx={{ _disabled: { color: "indigo5" } }}
                />
                <InputRightAddon color={"black"}>
                  {type === "buy" ? "PC" : "SOL"}
                </InputRightAddon>
              </InputGroup>
            </VStack>
          </Flex>
          <Flex justifyContent={"center"}>
            <Button
              w={400}
              colorScheme="pink"
              onClick={handleSwap}
              isLoading={isLoading}
            >
              Swap
            </Button>
          </Flex>
          <h2>
            Price impact:{" "}
            <span style={{ color: priceImpactColor }}>
              {priceImpact.toFixed(2)}%
            </span>
          </h2>
          <div>
            Routes plan: {" "}
            {routePlan.map((v, index) => (
              <span key={index}>
                <span style={{ color: "orange" }}>{v}</span>
                {index !== routePlan.length - 1 && <span style={{ color: "white" }}> -> </span>}
              </span>
            ))}
          </div>
          <h2 style={{ color: "red" }}>
            {priceImpact > 10 ? "HIGH PRICE IMPACT !" : ""}
          </h2>
        </VStack>
      </VStack>
    </>
  );
};

export default Trash;
