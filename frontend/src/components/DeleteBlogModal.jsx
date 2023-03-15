import React, { useState } from "react";
import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalFooter,
	ModalBody,
	ModalCloseButton,
	Button,
	useDisclosure,
	useToast,
	IconButton,
	Text,
} from "@chakra-ui/react";
import axios from "axios";
import { backendHost } from "../config";
import { DeleteIcon } from "@chakra-ui/icons";
import { useHistory } from "react-router-dom";

const DeleteBlogModal = ({ blog, fetchBlogs, isRedirect }) => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [isDeleting, setIsDeleting] = useState(false);
	const toast = useToast();
	const history = useHistory();

	const deleteBlog = () => {
		setIsDeleting(true);
		axios
			.delete(backendHost + `/api/forum/blogs/${blog.slug}/`)
			.then((res) => {
				setIsDeleting(false);
				onClose();
				toast({
					title: "博客删除成功",
					status: "error",
					duration: 20000,
					isClosable: true,
				});
				if (isRedirect) history.push("/");
				else fetchBlogs();
			})
			.catch((err) => {
				setIsDeleting(false);
				console.log(err.message);
			});
	};

	return (
		<>
			<IconButton
				aria-label="delete-blog"
				onClick={onOpen}
				size="sm"
				colorScheme="red"
				icon={<DeleteIcon />}
			></IconButton>

			<Modal isOpen={isOpen} onClose={onClose} size="xl">
				<ModalOverlay />
				<ModalContent onTouchCancel={(e) => e.preventDefault()}>
					<ModalHeader>删除博客</ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						<Text>
							你确定要删除博客 {blog.title}吗?
						</Text>
					</ModalBody>
					<ModalFooter>
						<Button
							mr={3}
							isLoading={isDeleting}
							onClick={deleteBlog}
							colorScheme="red"
						>
							删除
						</Button>
						<Button colorScheme="gray" onClick={onClose}>
							关闭
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	);
};

export default DeleteBlogModal;
