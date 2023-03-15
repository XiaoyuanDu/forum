import { StarIcon } from "@chakra-ui/icons"
import { IconButton, useToast} from "@chakra-ui/react"
import axios from "axios";
import React, { useEffect } from "react";
import { backendHost } from "../config";

const StarBlogButton = ({ blog, fetchBlogs }) => {
    const toast = useToast();
    const starBlog = () => {
        axios
            .put(
                backendHost +
                `/api/forum/blogs/${blog.slug}/`,
                {   
                    ...blog,
                    likes: blog.likes + 1,
                }
            )
            .then((res) => {
                toast({
                    title: "点赞成功",
                    status: "success",
                    duration: 1000,
                    isClosable: true,
                });
                fetchBlogs()

            })
    }
    return (
        <IconButton
            aria-label="star-blog"
            onClick={starBlog}
            size="sm"
            mr={1}
            colorScheme="orange"
            icon={<StarIcon />}
        ></IconButton>
    )
}

export default StarBlogButton