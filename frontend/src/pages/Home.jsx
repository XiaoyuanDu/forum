import React, { useContext, useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { tokenContext } from "../stores/Token";
import { Redirect } from "react-router-dom";
import axios from "axios";
import { backendHost } from "../config";
import {
	Heading,
	Box,
	Grid,
	useColorModeValue,
	Container,
	GridItem,
	Button,
	useToast,
	MenuButton,
	MenuList,
	MenuItem,
	Menu,
	Flex,
} from "@chakra-ui/react";

import Footer from "../components/Footer";
import BlogCard from "../components/BlogCard";
import Pagination from "../components/Pagination";
import PopularTagsCard from "../components/PopularTagsCard";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import MyFormTextareaInput from "../components/TextFields/MyFormTextAreaInput";
import MyFormTextInput from "../components/TextFields/MyFormTextInput";
import { FaSearch } from "react-icons/fa";
import { ChevronDownIcon } from "@chakra-ui/icons";
import BlogCardSkeleton from "../components/BlogCardSkeleton";
import MyFormMarkdownInput from "../components/TextFields/MyFormMarkdownInput";
// import wc from 'sensitive-word-filter'

const Home = () => {
	const [blogs, setBlogs] = useState(null);
	const [token] = useContext(tokenContext);
	const [perPage] = useState(10);
	const [pageCount, setPageCount] = useState(0);
	const [currentPage, setCurrentPage] = useState(1);
	const [count, setCount] = useState(0);
	const [content, setContent] = useState('\n\n\n\n\n\n\n\n\n')
	const ordering = {
		latest: "-date_modified",
		oldest: "date_modified",
		title: "title",
	};
	const [blogOrder, setBlogOrder] = useState(ordering.latest);
	const [loading, setLoading] = useState(true);
	const CardBackground = useColorModeValue("white", "gray.700");
	const toast = useToast();
	const fetchBlogs = (search) => {
		window.scrollTo(0, 0);
		let url = search
			? backendHost +
			  `/api/forum/blogs/?page=${currentPage}&size=${perPage}&ordering=${blogOrder}&search=${search}`
			: backendHost +
			  `/api/forum/blogs/?page=${currentPage}&size=${perPage}&ordering=${blogOrder}`;
			axios
				.get(url, {
					headers: token ? {
						Authorization: `Bearer ${token.access}`,
					} : {},
				})
				.then((res) => {
					setBlogs(res.data.results);
					setCount(res.data.count);   
					setPageCount(res.data.pages_count);
					setLoading(false);
				})
				.catch((err) => setBlogs(null));
	};
	useEffect(() => {
		fetchBlogs();
	}, [currentPage, perPage, token, blogOrder]);

	return (
		<>
			<Navbar />
			<Container maxW="container.lg" minWidth="auto">
				<>
					<Grid
						mt={4}
						templateColumns={{
							md: "repeat(3, 2fr)",
							base: "repeat(1, 1fr)",
						}}
						gap={{ md: 4, base: 0 }}
					>
						<GridItem colSpan={{ md: 2, base: 1 }}>
							<Formik
								initialValues={{
									search: "",
								}}
								validationSchema={Yup.object({
									search: Yup.string().max(
										250,
										"最多250个字符"
									),
								})}
								onSubmit={(
									{ search },
									{ setSubmitting, resetForm, setFieldError }
								) => {
									fetchBlogs(search);
									setSubmitting(false);
								}}
							>
								{(props) => (
									<Form>
										<MyFormTextInput
											label=""
											icon={FaSearch}
											name="search"
											placeholder="搜索..."
											maxLength={250}
											rightElement={
												<Button
													isLoading={
														props.isSubmitting
													}
													type="submit"
													size="sm"
													m={1}
												>
													搜索
												</Button>
											}
										/>
									</Form>
								)}
							</Formik>
							<Flex justifyContent="flex-end">
								<Menu>
									<MenuButton
										as={Button}
										colorScheme="gray"
										rightIcon={<ChevronDownIcon />}
									>
										排序条件
									</MenuButton>
									<MenuList>
										<MenuItem
											onClick={() => {
												setBlogOrder(
													ordering.latest
												);
												setLoading(true);
											}}
										>
											按时间从新到旧
										</MenuItem>
										<MenuItem
											onClick={() => {
												setBlogOrder(
													ordering.oldest
												);
												setLoading(true);
											}}
										>
											按时间从旧到新
										</MenuItem>
										<MenuItem
											onClick={() => {
												setBlogOrder(
													ordering.title
												);
												setLoading(true);
											}}
										>
											按标题
										</MenuItem>
									</MenuList>
								</Menu>
							</Flex>
							{loading ? (
								Array.from(
									{ length: perPage },
									(_, i) => i + 1
								).map((i) => (
									<BlogCardSkeleton
										contentLines={5}
										key={i}
									/>
								))
							) : blogs !== null && blogs.length > 0 ? (
								<>
									{blogs.map((blog, i) => (
										<BlogCard
											key={i}
											blog={blog}
											fetchBlogs={fetchBlogs}
										/>
									))}
									<Pagination
										pageCount={pageCount}
										setCurrentPage={setCurrentPage}
										currentPage={currentPage}
										count={count}
										pageSize={perPage}
									/>
								</>
							) : (
								<Heading
									my={3}
									textAlign="center"
									fontSize={{
										base: "xl",
										sm: "2xl",
										md: "3xl",
									}}
								>
									没有博客匹配
								</Heading>
							)}
							{}
							<Box
								bg={CardBackground}
								shadow={"md"}
								rounded={"lg"}
								my={2}
								p={6}
							>
								<Heading my={4} fontSize={"3xl"}>
									发表博客
								</Heading>
								<Formik
									initialValues={{
										title: "",
										tags: "",
									}}
									validationSchema={Yup.object({
										title: Yup.string()
											.min(
												10,
												"最少十个字符"
											)
											.max(
												250,
												"最多250个字符"
											)
											.required("标题不能为空"),

										tags: Yup.string()
											.max(
												150,
												"最多150个字符"
											)
											.required("必须有至少一个标签"),
									})}
									onSubmit={(
										{ title, tags },
										{
											setSubmitting,
											resetForm,
											setFieldError,
										}
									) => {
										let tagsArray = tags
											.split(",")
											.map((str) => ({
												name: str,
											}));
										if (token) 
											axios
												.post(
													backendHost +
														`/api/forum/blogs/`,
													{
														title,
														content:content.replace(/^\s+|\s+$/g,''),
														tags: tagsArray,
													}
												)
												.then((res) => {
													resetForm();
													setSubmitting(false);
													fetchBlogs();
													toast({
														title: "你的博客发布成功了",
														status: "success",
														duration: 20000,
														isClosable: true,
													});
												})
												.catch(({ response }) => {
													setSubmitting(false);
													if (response) {
														let errors = response.data;
														let errorKeys =
															Object.keys(errors);
														errorKeys.map((val) => {
															if (
																Array.isArray(
																	errors[val]
																)
															) {
																setFieldError(
																	val,
																	errors[val][0]
																);
																return null;
															} else {
																setFieldError(
																	val,
																	errors[val]
																);
																return null;
															}
														});
													}
												});
											else
												toast({
													title: "请先登录才能发布博客",
													status: "error",
													duration: 2000,
													isClosable: true,
												});
												setSubmitting(false);
									}}
								>
									{(props) => (
										<Form >
											<MyFormTextInput
												label="标题"
												name="title"
												placeholder="标题"
												maxLength={250}
											/>
											<MyFormMarkdownInput
												label="内容"
												name="content"
												placeholder="内容"
												maxLength={1000}
												value={content}
												onChange={(value, viewUpdate) => setContent(value)}
											/>
											<MyFormTextareaInput
												label="标签"
												name="tags"
												placeholder="标签"
												maxLength={150}
												helpText="用逗号分隔每个标签"
											/>
											<Button
												isLoading={props.isSubmitting}
												type="submit"
												mt={2}
												
											>
												发布
											</Button>
										</Form>
									)}
								</Formik>
							</Box>
						</GridItem>
						<GridItem colSpan={1}>
							<PopularTagsCard />
						</GridItem>
					</Grid>
				</>
			</Container>
			<Footer />
		</>
	);
};

export default Home;
