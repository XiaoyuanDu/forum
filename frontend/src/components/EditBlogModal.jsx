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
} from "@chakra-ui/react";
import * as Yup from "yup";
import { Formik, Form } from "formik";
import axios from "axios";
import { backendHost } from "../config";
import MyFormTextareaInput from "./TextFields/MyFormTextAreaInput";
import { EditIcon } from "@chakra-ui/icons";
import MyFormTextInput from "./TextFields/MyFormTextInput";
import MyFormMarkdownInput from "./TextFields/MyFormMarkdownInput";

const EditBlogModal = ({ blog, fetchBlogs }) => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [content, setContent] = useState('\n\n\n\n\n\n\n\n\n')

	const toast = useToast();

	return (
		<>
			<IconButton
				aria-label="edit-blog"
				onClick={onOpen}
				size="sm"
				mr={1}
				colorScheme="orange"
				icon={<EditIcon />}
			></IconButton>

			<Modal isOpen={isOpen} onClose={onClose} size="xl">
				<ModalOverlay />
				<ModalContent onTouchCancel={(e) => e.preventDefault()}>
					<ModalHeader>编辑博客</ModalHeader>
					<ModalCloseButton />
					<Formik
						initialValues={{
							title: blog.title,
							tags: blog.tags
								.map((obj) => obj.name)
								.toString(),
						}}
						validationSchema={Yup.object({
							title: Yup.string()
								.min(10, "最少十个字符")
								.max(
									250,
									"最多250个字符"
								)
								.required("标题不能为空！"),
							tags: Yup.string()
								.max(
									150,
									"最多150个字符"
								)
								.required("标签不能为空"),
						})}
						onSubmit={(
							{ title, tags },
							{ setSubmitting, resetForm, setFieldError }
						) => {
							let tagsArray = tags.split(",").map((str) => ({
								name: str,
							}));
							axios
								.put(
									backendHost +
										`/api/forum/blogs/${blog.slug}/`,
									{
										title,
										content: content.replace(/^\s+|\s+$/g,''),
										tags: tagsArray,
									}
								)
								.then((res) => {
									resetForm();
									setSubmitting(false);
									fetchBlogs();
									onClose();
									toast({
										title: "成功更新博客",
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
										helpText="Seprate each tag with comma"
									/>
								</ModalBody>
								<ModalFooter>
									<Button
										isLoading={props.isSubmitting}
										type="submit"
										colorScheme="orange"
										mr={3}
									>
										编辑
									</Button>
									<Button
										colorScheme="gray"
										onClick={onClose}
									>
										关闭
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

export default EditBlogModal;
