import { Badge } from "@chakra-ui/react";
import React from "react";
import { Link } from "react-router-dom";

const BlogTag = ({ tag }) => {
	return (
		<Link
			to={`/explore/${tag.name}-${tag.slug}`}
			style={{
				marginBottom: 3,
				marginLeft: 3,
			}}
		>
			<Badge px={2} py={1} fontSize=".8em">
				{tag.name}
			</Badge>
		</Link>
	);
};

export default BlogTag;
