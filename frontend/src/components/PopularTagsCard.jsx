import axios from "axios";
import React, { useEffect } from "react";
import { useState } from "react";

import {
	Heading,
	Box,
	Stack,
	useColorModeValue,
	Flex,
	Icon,
	Divider,
	IconButton,
	Spacer,
	Tooltip,
	Skeleton,
} from "@chakra-ui/react";
import { backendHost } from "../config";
import { useContext } from "react";
import { tokenContext } from "../stores/Token";
import { Link } from "react-router-dom";
import { FaCompass } from "react-icons/fa";
import BlogTag from "./BlogTag";

const PopularTagsSkeleton = () => {
	return Array.from(
		{ length: 10 },
		(_, i) => Math.floor(Math.random() * (80 - 40 + 1)) + 40
	).map((tag, i) => (
		<Skeleton
			key={i}
			style={{
				marginBottom: 3,
				marginLeft: 3,
			}}
			height="20px"
			width={`${tag}px`}
		/>
	));
};

const PopularTagsCard = () => {
	const [token] = useContext(tokenContext);
	const [tags, setTags] = useState(null);
	const CardBackground = useColorModeValue("white", "gray.700");
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		axios
			.get(backendHost + "/api/forum/tags/?page=1&size=10", {
				headers: token ? {
					Authorization: `Bearer ${token.access}`,
				} : {},
			})
			.then((res) => {
				setTags(res.data.results);
				setLoading(false);
			});
	}, [token]);
	return (
		<Box
			bg={CardBackground}
			shadow="md"
			rounded={"lg"}
			my={2}
			py={4}
			px={6}
		>
			<Flex alignItems="center">
				<Heading fontSize={"2xl"}>热点标签</Heading>
				<Spacer />
				<Link to="/explore">
					<Tooltip label="Explore" fontSize="md">
						<IconButton
							aria-label="explore"
							variant="ghost"
							icon={<Icon as={FaCompass} />}
						/>
					</Tooltip>
				</Link>
			</Flex>
			<Divider my={2} />
			<Stack align={"center"} direction={"row"} wrap="wrap">
				{loading ? (
					<PopularTagsSkeleton />
				) : tags !== null && tags.length > 0 ? (
					tags?.map((tag, i) => (
						<BlogTag key={i} tag={tag} />
					))
				) : (
					<Heading
						my={3}
						textAlign="center"
						fontSize={{
							base: "lg",
						}}
					>
						No Tags Found
					</Heading>
				)}
			</Stack>
		</Box>
	);
};

export default PopularTagsCard;
