import React from "react";
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
} from "@chakra-ui/react";
import * as Yup from "yup";
import { Formik, Form } from "formik";
import axios from "axios";
import { backendHost } from "../config";
import MyFormTextareaInput from "./TextFields/MyFormTextAreaInput";
import { EditIcon } from "@chakra-ui/icons";

const EditCommentModal = ({ comment, fetchBlog }) => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const toast = useToast();

	return (
		<>
			<IconButton
				aria-label="edit-comment"
				onClick={onOpen}
				size="sm"
				mr={1}
				colorScheme="orange"
				icon={<EditIcon />}
			></IconButton>

			<Modal isOpen={isOpen} onClose={onClose} size="xl">
				<ModalOverlay />
				<ModalContent onTouchCancel={(e) => e.preventDefault()}>
					<ModalHeader>Edit comment</ModalHeader>
					<ModalCloseButton />
					<Formik
						initialValues={{
							content: comment.content,
						}}
						validationSchema={Yup.object({
							content: Yup.string()
								.max(
									1000,
									"Must be Atleast 1000 Characters or less"
								)
								.required("This Field is Required"),
						})}
						onSubmit={(
							{ content },
							{ setSubmitting, resetForm, setFieldError }
						) => {
							axios
								.put(
									backendHost +
										`/api/forum/comments/${comment.id}/`,
									{
										content,
									}
								)
								.then((res) => {
									resetForm();
									setSubmitting(false);
									fetchBlog();
									onClose();
									toast({
										title: "comment Updated Sucessfully",
										status: "success",
										duration: 20000,
										isClosable: true,
									});
								})
								.catch(({ response }) => {
									setSubmitting(false);
									if (response) {
										let errors = response.data;
										let errorKeys = Object.keys(errors);
										errorKeys.map((val) => {
											if (Array.isArray(errors[val])) {
												setFieldError(
													val,
													errors[val][0]
												);
												return null;
											} else {
												setFieldError(val, errors[val]);
												return null;
											}
										});
									}
								});
						}}
					>
						{(props) => (
							<Form>
								<ModalBody>
									<MyFormTextareaInput
										label="Content"
										name="content"
										placeholder="Content"
										maxLength={1000}
									/>
								</ModalBody>
								<ModalFooter>
									<Button
										isLoading={props.isSubmitting}
										type="submit"
										colorScheme="orange"
										mr={3}
									>
										Edit
									</Button>
									<Button
										colorScheme="gray"
										onClick={onClose}
									>
										Close
									</Button>
								</ModalFooter>
							</Form>
						)}
					</Formik>
				</ModalContent>
			</Modal>
		</>
	);
};

export default EditCommentModal;
