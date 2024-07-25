"use client";

import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  Checkbox,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
  Link,
  InputGroup,
  InputRightElement,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import userAtom from "../atom/userAtom";
import { useSetRecoilState } from "recoil";
import useLoading from "../hooks/useLoading";

export default function Login({ toggleScreen }) {
  const setUser = useSetRecoilState(userAtom);
  const { loading, startLoader, stopLoader } = useLoading();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [inputs, setInputs] = useState({
    username: "",
    password: "",
  });
  const toast = useToast();
  const handleLogin = async () => {
    startLoader();
    try {
      const response = await fetch(
        "https://mercial-backend.onrender.com/api/users/login",
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
        description: `Welcome back ${data.username}`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      localStorage.setItem("user", JSON.stringify(data));
      setUser(data);
    } catch (error) {
      setError(error);
    } finally {
      stopLoader();
    }
  };
  return (
    <Flex align={"center"} justify={"center"}>
      <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
        <Stack align={"center"}>
          <Heading fontSize={"4xl"}>Sign in to your account</Heading>
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
            <FormControl id="email">
              <FormLabel>User Name</FormLabel>
              <Input
                type="username"
                onChange={(e) =>
                  setInputs({ ...inputs, username: e.target.value })
                }
                value={inputs.username}
              />
            </FormControl>
            <FormControl isRequired>
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
            <Stack spacing={10}>
              <Stack
                direction={{ base: "column", sm: "row" }}
                align={"start"}
                justify={"space-between"}
              >
                <Checkbox>Remember me</Checkbox>
                <Link color={"blue.400"}>Forgot password?</Link>
              </Stack>
              <Button
                loadingText="Logging in"
                size="lg"
                bg={useColorModeValue("gray.600", "gray.700")}
                color={"white"}
                _hover={{
                  bg: useColorModeValue("gray.700", "gray.800"),
                }}
                onClick={() => handleLogin()}
                isLoading={loading}
              >
                Sign in
              </Button>
            </Stack>
          </Stack>
          <Stack pt={6} onClick={toggleScreen}>
            <Text align={"center"}>
              Don't have an account? <Link color={"blue.400"}>Sign Up</Link>
            </Text>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
}
