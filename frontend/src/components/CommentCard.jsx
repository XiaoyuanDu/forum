import React, { useContext } from "react";
import {
	Box,
	Text,
	useColorModeValue,
	Flex,
	Avatar,
	Spacer,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import moment from "moment";
import { userContext } from "../stores/User";
import DeleteCommentModal from "./DeleteCommentModal";
import EditCommentModal from "./EditCommentModal";

const CommentCard = ({ comment, fetchBlog }) => {
	const CardBackground = useColorModeValue("white", "gray.700");
	const [user] = useContext(userContext);

	return (
		<Box my={2} bg={CardBackground} shadow="md" rounded={"lg"} p={6}>
			<Flex>
				<Link to={`/profile/${comment.user?.username}`}>
					<Flex alignItems="center">
						<Avatar
							borderWidth={2}
							borderColor="primary.500"
							size={"md"}
							src={comment.user.profile.image}
							alt={"Avatar Alt"}
							loading="lazy"
							name={comment.user?.username}
						/>
						<Flex direction="column">
							<Text fontWeight="700" ml={4}>
								{comment.user.username}
							</Text>
							<Text
								color={useColorModeValue(
									"primary.500",
									"primary.100"
								)}
								fontSize="sm"
								ml={4}
							>
								@{comment.user.username}
							</Text>
						</Flex>
					</Flex>
				</Link>
				<Spacer />
				{user?.id === comment.user.id ? (
					<Flex alignItems="center">
						<EditCommentModal
							comment={comment}
							fetchBlog={fetchBlog}
						/>
						<DeleteCommentModal
							comment={comment}
							fetchBlog={fetchBlog}
						/>
					</Flex>
				) : (
					<></>
				)}
			</Flex>
			<Text my={4}>{comment.content}</Text>
			<Text>{`发表于 ${moment(comment.date_created).format(
				"YYYY年 MM月 D日"
			)}`}</Text>
		</Box>
	);
};

export default CommentCard;
