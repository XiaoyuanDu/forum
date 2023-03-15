import axios from "axios";
import React, { useEffect } from "react";
import remarkGfm from 'remark-gfm'
import { useState } from "react";
import { useParams } from "react-router";
import { backendHost } from "../config";
import {
	Heading,
	Box,
	Text,
	Stack,
	useColorModeValue,
	Container,
	Flex,
	Button,
	Divider,
	Avatar,
	useToast,
	Spacer,
	chakra
} from "@chakra-ui/react";
import ChakraUIRenderer from 'chakra-ui-markdown-renderer';
import { Link, Redirect } from "react-router-dom";
import { useContext } from "react";
import { tokenContext } from "../stores/Token";
import Navbar from "../components/Navbar";
import moment from "moment";
import CommentCard from "../components/CommentCard";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import MyFormTextareaInput from "../components/TextFields/MyFormTextAreaInput";
import { userContext } from "../stores/User";
import EditBlogModal from "../components/EditBlogModal";
import DeleteBlogModal from "../components/DeleteBlogModal";
import BlogTag from "../components/BlogTag";
import { Helmet } from "react-helmet";
import BlogCardSkeleton from "../components/BlogCardSkeleton";
import CommentCardSkeleton from "../components/CommentCardSkeleton";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import { StarIcon } from "@chakra-ui/icons";
import StarBlogButton from "../components/StarBlogButton";

const BlogDetail = () => {
	const [token] = useContext(tokenContext);
	const [user] = useContext(userContext);
	const CardBackground = useColorModeValue("white", "gray.700");
	const { slug } = useParams();
	const [blog, setBlog] = useState(null);
	const [isError, setIsError] = useState(false);
	const userNameTextColor = useColorModeValue("primary.500", "primary.100");
	const [loading, setLoading] = useState(true);
	const ParagraphColor = useColorModeValue("gray.700", "gray.400");

	const toast = useToast();
	const fetchBlog = () => {
		axios
			.get(backendHost + `/api/forum/blogs/${slug}/`, {
				headers: token ? {
					Authorization: `Bearer ${token.access}`,
				} : {},
			})
			.then((res) => {
				setBlog(res.data);
				setLoading(false);
			})
			.catch((err) => setIsError(true));
	};
	const viewBlog = () => {
		axios
            .put(
                backendHost +
                `/api/forum/blogs/${blog.slug}/`,
                {   
                    ...blog,
                    views: blog.views + 1,
                }
            )
	}
	useEffect(() => {
		fetchBlog();
	}, [slug, token]);

	useEffect(() => {
		if (blog) viewBlog();
	}, [blog])
	if (isError) return <Redirect to="/404" />;
	return (
		<>
			<Navbar />
			{loading ? (
				<Container maxW="container.lg" minWidth="auto">
					<BlogCardSkeleton contentLines={10} />
					{Array.from({ length: 3 }, (_, i) => i + 1).map((i) => (
						<CommentCardSkeleton contentLines={3} key={i} />
					))}
				</Container>
			) : blog ? (
				<Container maxW="container.lg" minWidth="auto">
					<Helmet>
						<title>{blog.title} - 校园博客论坛</title>
					</Helmet>
					<Box
						bg={CardBackground}
						shadow={"md"}
						rounded={"lg"}
						my={2}
						p={6}
					>
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
										name={blog.user.username}
									/>
									<Flex direction="column">
										<Text fontWeight="700" ml={4}>
											{blog.user.username}
										</Text>
										<Text
											color={userNameTextColor}
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
								<StarBlogButton blog={blog} fetchBlogs={fetchBlog} />
								{user && user.id === blog.user.id ? (
									<>
										<EditBlogModal
											blog={blog}
											fetchBlogs={fetchBlog}
										/>
										<DeleteBlogModal
											blog={blog}
											isRedirect={true}
											fetchBlogs={fetchBlog}
										/>
									</>
								) : (
									<></>
								)}
							</Flex>

						</Flex>
						<Heading mt={4} fontSize={"3xl"}>
							{blog.title}
						</Heading>
						<Text>{`${moment(blog.date_created).format(
							"YYYY 年 MM 月 D 日 "
						)} 发布`}</Text>
						<Text mb={4} textColor={ParagraphColor}>
							{blog.views} 浏览 · {blog.likes} 点赞 · {blog.comments.length} 评论
						</Text>
						<ReactMarkdown components={ChakraUIRenderer()} remarkPlugins={[remarkGfm]}>{blog.content}</ReactMarkdown>
						<Divider my={4} />
						<Stack
							align={"center"}
							justify={"center"}
							direction={"row"}
							wrap="wrap"
						>
							{blog.tags.map((tag, i) => {
								return <BlogTag key={i} tag={tag} />;
							})}
						</Stack>
					</Box>
					<Heading my={6} fontSize="3xl">
						全部评论 ({blog.comments.length})
					</Heading>
					<Box
						bg={CardBackground}
						shadow={"md"}
						rounded={"lg"}
						my={2}
						p={4}
					>
						<Formik
							initialValues={{
								comment: "",
							}}
							validationSchema={Yup.object({
								comment: Yup.string()
									.max(
										300,
										"Must be Atleast 300 Characters or less"
									)
									.required("评论内容不能为空！"),
							})}
							onSubmit={(
								{ comment },
								{ setSubmitting, resetForm, setFieldError }
							) => {
								if (token)
									axios
										.post(
											backendHost +
											`/api/forum/blogs/${blog.slug}/comment/`,
											{
												content: comment,
											}
										)
										.then((res) => {
											resetForm();
											setSubmitting(false);
											fetchBlog();
											toast({
												title: "成功发表评论",
												status: "success",
												duration: 20000,
												isClosable: true,
											});
										})
										.catch((err) => {
											setSubmitting(false);
											setFieldError(
												"comment",
												"Error Occured"
											);
										});
								else
									toast({
										title: "请先登录才能发布评论",
										status: "error",
										duration: 2000,
										isClosable: true,
									});
								setSubmitting(false);
							}}
						>
							{(props) => (
								<Form>
									<MyFormTextareaInput
										label="评论"
										name="comment"
										placeholder="发表你的评论"
										maxLength={100}
									/>
									<Button
										isLoading={props.isSubmitting}
										type="submit"
									>
										发表评论
									</Button>
								</Form>
							)}
						</Formik>
					</Box>
					{blog.comments.map((comment, i) => (
						<CommentCard
							comment={comment}
							fetchBlog={fetchBlog}
							key={i}
						/>
					))}
				</Container>
			) : (
				<></>
			)}
		</>
	)
};

export default BlogDetail;
