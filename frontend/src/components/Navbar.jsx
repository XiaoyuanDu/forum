import React, { useEffect, useState } from "react";
import {
	Box,
	Flex,
	HStack,
	IconButton,
	useDisclosure,
	useColorModeValue,
	Stack,
	useColorMode,
	Container,
	Icon,
	MenuItem,
	Button,
	Menu,
	MenuButton,
	MenuList,
	Text,
	Link,
} from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon, ChevronDownIcon } from "@chakra-ui/icons";
import {
	FaCog,
	FaCompass,
	FaHome,
	FaMoon,
	FaSignInAlt,
	FaSignOutAlt,
	FaSun,
	FaUser,
	FaUserPlus,
} from "react-icons/fa";
import { tokenContext } from "../stores/Token";
import { adminHost, backendHost, config } from "../config";
import Headroom from "react-headroom";
import { userContext } from "../stores/User";
import { Link as RouterLink } from "react-router-dom";
import axios from "axios";

const NavLink = ({ children, href, icon }) => (
	<RouterLink to={href}>
		<Button
			colorScheme="gray"
			leftIcon={icon}
			isFullWidth={{ base: true, md: false }}
		>
			{children}
		</Button>
	</RouterLink>
);

const MenuLink = ({ children, href, icon }) => (
	<RouterLink to={href}>
		<MenuItem icon={icon} alignItems="center">
			{children}
		</MenuItem>
	</RouterLink>
);

export default function Navbar() {
	const [token] = React.useContext(tokenContext);
	const [user] = React.useContext(userContext);
	const { colorMode, toggleColorMode } = useColorMode();
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [isAdmin, setIsAdmin] = useState(false);
	const isUserAdmin = () => {
		if (token !== null){
			axios.get(backendHost + '/api/users/is_admin/', {
				headers: {
					Authorization: `Bearer ${token.access}`,
				}
			}).then((res) => {
				console.debug(res)
				if (res.status === 200) {
					setIsAdmin(res.data.is_admin)
				} else {
					setIsAdmin(false)
				}
				
			}
			).catch((err) => { setIsAdmin(false) })
		} else {
			setIsAdmin(false)
		}
		
	}
	useEffect(() => {
		isUserAdmin()
	}, [token])
	return (
		<Headroom>
			<Box px={4} bg={useColorModeValue("gray.50", "gray.700")}>
				<Container maxW={"6xl"}>
					<Flex
						h={16}
						alignItems={"center"}
						justifyContent={"space-between"}
					>
						<IconButton
							size={"md"}
							icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
							aria-label={"Open Menu"}
							colorScheme="gray"
							display={{ md: "none" }}
							onClick={isOpen ? onClose : onOpen}
						/>
						<HStack spacing={8} alignItems={"center"}>
							<Box>
								<RouterLink to="/">
									<Text fontSize='2xl' fontWeight='bold'> 校园博客 </Text>
								</RouterLink>
							</Box>
							<HStack
								as={"nav"}
								spacing={4}
								display={{ base: "none", md: "flex" }}
							>
								<>
									<NavLink
										href="/"
										icon={<Icon as={FaHome} />}
									>
										首页
									</NavLink>
									<NavLink
										icon={<Icon as={FaCompass} />}
										href="/explore"
									>
										探索
									</NavLink>

									<Menu>
										<MenuButton
											as={Button}
											colorScheme="gray"
											rightIcon={<ChevronDownIcon />}
										>
											用户
										</MenuButton>

										{token ? (
											<MenuList>
												<MenuLink
													href={`/profile/${user?.username}`}
													icon={<Icon as={FaUser} />}
												>
													个人资料
												</MenuLink>
												<MenuLink
													icon={
														<Icon
															as={FaSignOutAlt}
														/>
													}
													href="/logout"
												>
													登出
												</MenuLink>
												<MenuLink
													icon={<Icon as={FaCog} />}
													href="/settings"
												>
													设置
												</MenuLink>
											</MenuList>) : (
											<MenuList>
												<MenuLink
													icon={<Icon as={FaSignInAlt} />}
													href="/login"
												>
													登录
												</MenuLink>
												<MenuLink
													icon={<Icon as={FaUserPlus} />}
													href="/signup"
												>
													注册
												</MenuLink>
											</MenuList>
										)
										}

									</Menu>
									{		console.log(isAdmin)}
									{isAdmin ? (<a href={`${adminHost}/admin/default`} rel="noopener noreferrer" target="_blank">
										<Text fontWeight={700} fontSize={16}>博客管理</Text>
									</a>) : <></>}
								</>
							</HStack>
						</HStack>
						<Flex alignItems={"center"}>
							<IconButton
								aria-label="dark-mode-toggle"
								colorScheme="gray"
								onClick={() => { toggleColorMode(); document.documentElement.setAttribute('data-color-mode', colorMode == 'dark' ? 'light' : 'dark') }}
								icon={
									colorMode === "light" ? (
										<FaMoon />
									) : (
										<FaSun />
									)
								}
							/>
						</Flex>
					</Flex>

					{isOpen ? (
						<Box pb={4} display={{ md: "none" }}>
							<Stack as={"nav"} spacing={4}>
								{token ? (
									<>
										<NavLink
											href="/"
											icon={<Icon as={FaHome} />}
										>
											Home
										</NavLink>
										<NavLink
											icon={<Icon as={FaCompass} />}
											href="/explore"
										>
											Explore
										</NavLink>
										<Menu>
											<MenuButton
												colorScheme="gray"
												as={Button}
												rightIcon={<ChevronDownIcon />}
											>
												User
											</MenuButton>
											<MenuList>
												<MenuLink
													href={`/profile/${user?.username}`}
													icon={<Icon as={FaUser} />}
												>
													Profile
												</MenuLink>
												<MenuLink
													icon={
														<Icon
															as={FaSignOutAlt}
														/>
													}
													href="/logout"
												>
													Logout
												</MenuLink>
												<MenuLink
													icon={<Icon as={FaCog} />}
													href="/settings"
												>
													Settings
												</MenuLink>
											</MenuList>
										</Menu>
									</>
								) : (
									<>
										<NavLink
											icon={<Icon as={FaSignInAlt} />}
											href="/login"
										>
											Login
										</NavLink>
										<NavLink
											icon={<Icon as={FaUserPlus} />}
											href="/signup"
										>
											Signup
										</NavLink>
									</>
								)}
							</Stack>
						</Box>
					) : null}
				</Container>
			</Box>
		</Headroom>
	);
}
