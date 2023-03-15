import axios from "axios";
import React, { useEffect, useState } from "react";
import { backendHost } from "../config";
import { useParams, Redirect } from "react-router";
import Navbar from "../components/Navbar";
import { Heading, Grid, Container, GridItem } from "@chakra-ui/react";
import ProfileCard from "../components/ProfileCard";
import Footer from "../components/Footer";
import BlogCard from "../components/BlogCard";
import Pagination from "../components/Pagination";
import { useContext } from "react";
import { tokenContext } from "../stores/Token";
import { Helmet } from "react-helmet";
import BlogCardSkeleton from "../components/BlogCardSkeleton";

const Profile = () => {
	const [token] = useContext(tokenContext);
	const [user, setUser] = useState(null);
	const [blogs, setBlogs] = useState(null);
	const [isError, setIsError] = useState(false);
	const { username } = useParams();

	const [perPage] = useState(10);
	const [pageCount, setPageCount] = useState(0);
	const [currentPage, setCurrentPage] = useState(1);
	const [count, setCount] = useState(0);
	const [loadingProfile, setLoadingProfile] = useState(true);
	const [loadingblogs, setLoadingBlogs] = useState(true);

	const fetchBlogs = () => {
		axios
			.get(
				backendHost +
					`/api/users/blogs/${username}/?page=${currentPage}&size=${perPage}`
			)
			.then((res) => {
				setBlogs(res.data.results);
				setCount(res.data.count);
				setPageCount(res.data.pages_count);
				setLoadingBlogs(false);
			})
			.catch((err) => {
				setBlogs(null);
				setLoadingBlogs(false);
			});
	};

	useEffect(() => {
		window.scrollTo(0, 0);
		axios
			.get(backendHost + `/api/users/user-profile/${username}/`)
			.then((res) => {
				setUser(res.data);
				setLoadingProfile(false);
			})
			.catch((err) => setIsError(true));
		fetchBlogs();
	}, [username, currentPage, perPage]);
	if (isError) return <Redirect to="/404" />;
	return token ? (
		<>
			<Helmet>
				<title>
					{user ? `${user.username} - 校园博客论坛` : "校园博客论坛"}
				</title>
			</Helmet>
			<Navbar />
			<Container maxW="container.lg" minWidth="auto">
				<Grid
					mt={4}
					templateColumns={{
						md: "repeat(3, 2fr)",
						base: "repeat(1, 1fr)",
					}}
					gap={{ md: 4, base: 0 }}
				>
					<GridItem colSpan={{ md: 2, base: 1 }}>
						{loadingblogs ? (
							Array.from(
								{ length: perPage },
								(_, i) => i + 1
							).map((i) => (
								<BlogCardSkeleton
									contentLines={5}
									key={i}
								/>
							))
						) : blogs !== null ? (
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
								{username} 还没有发布过博客
							</Heading>
						)}
					</GridItem>
					<GridItem colSpan={1}>
						<ProfileCard user={user} isLoading={loadingProfile} />
					</GridItem>
				</Grid>
			</Container>
			<Footer />
		</>
	) : (
		<Redirect to="/login" />
	);
};

export default Profile;
