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
import { backendHost } from "./../config";
import { DeleteIcon } from "@chakra-ui/icons";

const DeleteCommentModal = ({ comment, fetchBlog }) => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [isDeleting, setIsDeleting] = useState(false);
	const toast = useToast();

	const deleteComment = () => {
		setIsDeleting(true);
		axios
			.delete(backendHost + `/api/forum/comments/${comment.id}/`)
			.then((res) => {
				setIsDeleting(false);
				onClose();
				toast({
					title: "Comment Deleted",
					status: "error",
					duration: 20000,
					isClosable: true,
				});
				fetchBlog();
			})
			.catch((err) => {
				setIsDeleting(false);
				console.log(err.message);
			});
	};

	return (
		<>
			<IconButton
				onClick={onOpen}
				size="sm"
				colorScheme="red"
				icon={<DeleteIcon />}
			></IconButton>

			<Modal isOpen={isOpen} onClose={onClose} size="xl">
				<ModalOverlay />
				<ModalContent onTouchCancel={(e) => e.preventDefault()}>
					<ModalHeader>Delete Comment</ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						<Text>Do you want to delete comment?</Text>
					</ModalBody>
					<ModalFooter>
						<Button
							mr={3}
							isLoading={isDeleting}
							onClick={deleteComment}
							colorScheme="red"
						>
							Delete
						</Button>
						<Button colorScheme="gray" onClick={onClose}>
							Close
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	);
};

export default DeleteCommentModal;
