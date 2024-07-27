import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  HStack,
  InputRightElement,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
  Link,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useSetRecoilState } from "recoil";
import userAtom from "../atom/userAtom";
import useLoading from "../hooks/useLoading";

export default function Signup({ toggleScreen }) {
  const { loading, startLoader, stopLoader } = useLoading();
  const setUser = useSetRecoilState(userAtom);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [inputs, setInputs] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
  });

  const toast = useToast();

  const handleSignUp = async () => {
    startLoader();
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/users/signup`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(inputs),
        }
      );
      const data = await response.json();
      if (data.error) {
        console.log(data);
        toast({
          title: "Error",
          description: data.error,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        return;
      }
      toast({
        title: "Success",
        description: `Welcome ${data.username}`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      localStorage.setItem("user", JSON.stringify(data));
      localStorage.setItem("token", JSON.stringify(data.token));
      setUser(data);
    } catch (error) {
      console.log(error);
    } finally {
      stopLoader();
    }
  };

  return (
    <Flex align={"center"} justify={"center"}>
      <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
        <Stack align={"center"}>
          <Heading fontSize={"4xl"} textAlign={"center"}>
            Sign up
          </Heading>
        </Stack>
        <Box
          rounded={"lg"}
          bg={useColorModeValue("white", "gray.dark")}
          boxShadow={"lg"}
          p={8}
          w={{
            base: "full",
            sm: "400px",
            md: "500px",
          }}
        >
          <Stack spacing={4}>
            {/* <HStack> */}
            <Box>
              <FormControl id="firstname" isRequired>
                <FormLabel>Full Name</FormLabel>
                <Input
                  type="text"
                  onChange={(e) =>
                    setInputs({ ...inputs, name: e.target.value })
                  }
                  value={inputs.name}
                />
              </FormControl>
            </Box>
            <Box>
              <FormControl id="username" isRequired>
                <FormLabel>User Name</FormLabel>
                <Input
                  type="text"
                  onChange={(e) =>
                    setInputs({ ...inputs, username: e.target.value })
                  }
                  value={inputs.username}
                />
              </FormControl>
            </Box>
            {/* </HStack> */}
            <FormControl id="email" isRequired>
              <FormLabel>Email address</FormLabel>
              <Input
                type="email"
                onChange={(e) =>
                  setInputs({ ...inputs, email: e.target.value })
                }
                value={inputs.email}
              />
            </FormControl>
            <FormControl id="password" isRequired>
              <FormLabel>Password</FormLabel>
              <InputGroup>
                <Input
                  type={showPassword ? "text" : "password"}
                  onChange={(e) =>
                    setInputs({ ...inputs, password: e.target.value })
                  }
                  value={inputs.password}
                />
                <InputRightElement h={"full"}>
                  <Button
                    variant={"ghost"}
                    onClick={() =>
                      setShowPassword((showPassword) => !showPassword)
                    }
                  >
                    {showPassword ? (
                      <FaEye size={24} />
                    ) : (
                      <FaEyeSlash size={24} />
                    )}
                  </Button>
                </InputRightElement>
              </InputGroup>
            </FormControl>
            <Stack spacing={10} pt={2}>
              <Button
                loadingText="Submitting"
                size="lg"
                bg={useColorModeValue("gray.600", "gray.700")}
                color={"white"}
                _hover={{
                  bg: useColorModeValue("gray.700", "gray.800"),
                }}
                onClick={() => handleSignUp()}
                isLoading={loading}
              >
                Sign up
              </Button>
            </Stack>
            <Stack pt={6} onClick={toggleScreen}>
              <Text align={"center"}>
                Already a user? <Link color={"blue.400"}>Login</Link>
              </Text>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
}
