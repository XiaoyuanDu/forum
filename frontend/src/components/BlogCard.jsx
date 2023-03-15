/* eslint-disable */
import React from "react";
import {
	Heading,
	Box,
	Text,
	Stack,
	useColorModeValue,
	Flex,
	Divider,
	Avatar,
	Spacer,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import moment from "moment";
import { useContext } from "react";
import { userContext } from "../stores/User";
import EditBlogModal from "./EditBlogModal";
import DeleteBlogModal from "./DeleteBlogModal";
import BlogTag from "./BlogTag";
import StarBlogButton from "./StarBlogButton";

const BlogCard = ({ blog, fetchBlogs }) => {
	const CardBackground = useColorModeValue("white", "gray.700");
	const ParagraphColor = useColorModeValue("gray.700", "gray.400");
	const [user] = useContext(userContext);
	console.log(blog.content)
	return (
		<Box my={2} bg={CardBackground} shadow="md" rounded={"lg"} p={6}>
			<Flex>
				<Link to={`/profile/${blog.user?.username}`}>
					<Flex alignItems="center">
						<Avatar
							borderWidth={2}
							borderColor="primary.500"
							size={"md"}
							src={blog.user.profile.image}
							alt={"Avatar Alt"}
							loading="lazy"
							name={blog.user?.username}
						/>
						<Flex direction="column">
							<Text fontWeight="700" ml={4}>
								{blog.user.username}
							</Text>
							<Text
								color={useColorModeValue(
									"primary.500",
									"primary.100"
								)}
								fontSize="sm"
								ml={4}
							>
								@{blog.user.username}
							</Text>
						</Flex>
					</Flex>
				</Link>
				<Spacer />
				<Flex alignItems="center">
					<StarBlogButton blog={blog} fetchBlogs={fetchBlogs}/>
					{user && user.id === blog.user.id ? (
						<>
							<EditBlogModal
								blog={blog}
								fetchBlogs={fetchBlogs}
							/>
							<DeleteBlogModal
								blog={blog}
								isRedirect={true}
								fetchBlogs={fetchBlogs}
							/>
						</>
					) : (
						<></>
					)}
				</Flex>
			</Flex>
			<Link to={`/blogs/${blog.slug}`}>
				<Heading mt={4} fontSize={"3xl"}>
					{blog.title}
				</Heading>
				<Text>{`${moment(blog.date_created).format(
					"YYYY 年 MM 月 D 日 "
				)} 发布`}</Text>
				<Text mb={4} textColor={ParagraphColor}>
					{blog.views} 浏览 · {blog.likes} 点赞 · {blog.comments.length} 评论
				</Text>

			</Link>
			<Divider my={4} />
			<Stack
				align={"center"}
				justify={"center"}
				direction={"row"}
				wrap="wrap"
			>
				{blog.tags.map((tag, i) => {
					return <BlogTag tag={tag} key={i} />;
				})}
			</Stack>
		</Box>
	);
};

export default BlogCard;
