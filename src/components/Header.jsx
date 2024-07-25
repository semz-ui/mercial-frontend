import {
  Avatar,
  Flex,
  Image,
  Link,
  Text,
  useColorMode,
} from "@chakra-ui/react";
import { Link as RouterLink, useLocation } from "react-router-dom";
import React from "react";
import { useRecoilValue } from "recoil";
import userAtom from "../atom/userAtom";
import { CgHome } from "react-icons/cg";
import { BsChatFill, BsPerson, BsPersonCircle } from "react-icons/bs";
import Logout from "./Logout";

const Header = () => {
  const user = useRecoilValue(userAtom);
  const { colorMode, toggleColorMode } = useColorMode();
  const { pathname } = useLocation();
  console.log(pathname);
  return (
    <Flex justifyContent={"space-between"} alignItems={"center"} mt={1} mb={12}>
      {user && (
        <Link as={RouterLink} to={"/"}>
          <CgHome size={24} />
        </Link>
      )}
      <Text
        onClick={toggleColorMode}
        cursor={"pointer"}
        fontWeight={"bold"}
        fontSize={40}
      >
        M
      </Text>

      {user && (
        <>
          <Link as={RouterLink} to={`/chat`}>
            <BsChatFill size={24} />
          </Link>
          {pathname !== `/${user.username}` && (
            <Link as={RouterLink} to={`/${user.username}`}>
              {/* <BsPersonCircle size={24} /> */}
              <Avatar src={user?.profilePic} name="user?.name" w={10} h={10} />
            </Link>
          )}
          {pathname === `/${user.username}` && (
            <Link as={RouterLink} to={`/${user.username}`}>
              <Logout />
            </Link>
          )}
        </>
      )}
    </Flex>
  );
};

export default Header;
