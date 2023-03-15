import React, { useContext, useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { tokenContext } from "../stores/Token";
import { Link, Redirect } from "react-router-dom";
import axios from "axios";
import { backendHost } from "../config";
import { Helmet } from "react-helmet";
import {
	Heading,
	Box,
	Grid,
	Badge,
	useColorModeValue,
	Container,
	GridItem,
	Flex,
	Button,
	Divider,
	Spacer,
	Skeleton,
} from "@chakra-ui/react";

import Footer from "../components/Footer";
import Pagination from "../components/Pagination";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import MyFormTextInput from "../components/TextFields/MyFormTextInput";
import { FaSearch } from "react-icons/fa";
import { ArrowForwardIcon } from "@chakra-ui/icons";

const TagCardSkeleton = () => {
	const CardBackground = useColorModeValue("white", "gray.700");
	return (
		<Box
			my={2}
			py={4}
			px={6}
			bg={CardBackground}
			shadow="md"
			rounded={"lg"}
		>
			<Skeleton>
				<Heading my={4}>...</Heading>
			</Skeleton>

			<Divider my={3} />
			{Array.from({ length: 3 }, (_, i) => i + 1).map((blog, i) => (
				<>
					<Skeleton>
						<Heading fontSize={"md"} my={4}>
							...
						</Heading>
					</Skeleton>
					<Divider my={3} />
				</>
			))}
			<Skeleton>
				<Button rightIcon={<ArrowForwardIcon />}>查看更多</Button>
			</Skeleton>
		</Box>
	);
};

const TagCard = ({ tag }) => {
	const CardBackground = useColorModeValue("white", "gray.700");
	return (
		<Box my={2} bg={CardBackground} shadow="md" rounded={"lg"} p={6}>
			<Flex>
				<Heading fontSize={"2xl"}>{tag.name}</Heading>
				<Spacer />
				<Badge px={2} py={1} fontSize=".8em">
					{tag.blogs.length}
				</Badge>
			</Flex>
			<Divider my={3} />
			{tag.blogs && tag.blogs.length > 0 ? (
				<>
					{tag.blogs.slice(0, 5).map((blog, i) => (
						<Link key={i} to={`/blogs/${blog.slug}`}>
							<Heading fontSize={"md"}>
								{blog.title.length <= 32
									? blog.title
									: `${blog.title.substring(0, 32)}...`}
							</Heading>
							<Divider my={3} />
						</Link>
					))}
					<Link to={`/explore/${tag.name}-${tag.slug}`}>
						<Button rightIcon={<ArrowForwardIcon />}>
							查看更多
						</Button>
					</Link>
				</>
			) : (
				<Heading fontSize={"md"}>
					没有与该标签关联的博客
				</Heading>
			)}
		</Box>
	);
};

const Explore = () => {
	const [token] = useContext(tokenContext);
	const [perPage] = useState(12);
	const [pageCount, setPageCount] = useState(0);
	const [currentPage, setCurrentPage] = useState(1);
	const [count, setCount] = useState(0);
	const [tags, setTags] = useState(null);
	const [loading, setLoading] = useState(true);
	const [init, setInit] = useState(true)

	const fetchTags = (search) => {
		let url = search
			? backendHost +
			`/api/forum/tags/?page=${currentPage}&size=${perPage}&search=${search}`
			: backendHost +
			`/api/forum/tags/?page=${currentPage}&size=${perPage}`;
		axios
			.get(url, {
				headers: token ? {
					Authorization: `Bearer ${token.access}`,
				} : {},
			})
			.then((res) => {
				setTags(res.data.results);
				setCount(res.data.count);
				setPageCount(res.data.pages_count);
				setLoading(false);
			})
			.catch((err) => setTags(null));
	};
	useEffect(() => {
		window.scrollTo(0, 0);
		fetchTags();
	}, [currentPage]);
	return (<>
		<Helmet>
			<title>搜索标签 - 校园博客论坛</title>
		</Helmet>
		<Navbar />
		<Container maxW="container.lg" minWidth="auto">
			{init || loading || (tags !== null && tags.length > 0) ? (
				<Heading
					my={4}
					textAlign="center"
					fontSize={{
						base: "xl",
						sm: "2xl",
						md: "3xl",
					}}
				>
					搜索标签
				</Heading>
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
					没有相匹配的标签
				</Heading>
			)}

			<Formik
				initialValues={{
					search: "",
				}}
				validationSchema={Yup.object({
					search: Yup.string().max(
						50,
						"Must be Atleast 50 Characters or less"
					),
				})}
				onSubmit={(
					{ search },
					{ setSubmitting, resetForm, setFieldError }
				) => {
					fetchTags(search);
					setSubmitting(false);
					setInit(false)
				}}
			>
				{(props) => (
					<Form>
						<MyFormTextInput
							label=""
							icon={FaSearch}
							name="search"
							placeholder="Search"
							maxLength={50}
							rightElement={
								<Button
									isLoading={props.isSubmitting}
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
			<Grid
				mt={4}
				templateColumns={{
					md: "repeat(2, 2fr)",
					lg: "repeat(3, 3fr)",
					base: "repeat(1, 1fr)",
				}}
				gap={{ md: 4, base: 0 }}
			>
				{loading
					? Array.from({ length: perPage }, (_, i) => i + 1).map(
						(i) => (
							<GridItem key={i} colSpan={1}>
								<TagCardSkeleton key={i} />
							</GridItem>
						)
					)
					: tags !== null && tags.length > 0
						? tags.map((tag, i) => (
							<GridItem key={i} colSpan={1}>
								<TagCard tag={tag} key={i} />
							</GridItem>
						))
						: null}
				{ }
			</Grid>
			<Pagination
				pageCount={pageCount}
				setCurrentPage={setCurrentPage}
				currentPage={currentPage}
				count={count}
				pageSize={perPage}
			/>
		</Container>
		<Footer />
	</>)

};

export default Explore;
