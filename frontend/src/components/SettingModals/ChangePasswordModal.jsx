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
} from "@chakra-ui/react";
import * as Yup from "yup";
import { Formik, Form } from "formik";
import { FaKey } from "react-icons/fa";
import axios from "axios";
import { backendHost } from "../../config";
import { InfoOutlineIcon } from "@chakra-ui/icons";
import MyFormTextInput from "../TextFields/MyFormTextInput";

const ChangePasswordModal = () => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const toast = useToast();

	return (
		<>
			<Button
				onClick={onOpen}
				mt={2}
				leftIcon={<InfoOutlineIcon />}
				colorScheme="orange"
			>
				更改密码
			</Button>

			<Modal isOpen={isOpen} onClose={onClose} size="xl">
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>更改密码</ModalHeader>
					<ModalCloseButton />
					<Formik
						initialValues={{
							current_password: "",
							new_password: "",
							confirm_new_password: "",
						}}
						validationSchema={Yup.object({
							current_password: Yup.string()
								.min(8, "Must be atleast 8 characters")
								.max(
									20,
									"Must be Atleast 20 Characters or less"
								)
								.required("This Field is Required"),
							new_password: Yup.string()
								.min(8, "Must be atleast 8 characters")
								.max(
									20,
									"Must be Atleast 20 Characters or less"
								)
								.required("This Field is Required"),
							confirm_new_password: Yup.string()
								.min(8, "Must be atleast 8 characters")
								.max(
									20,
									"Must be Atleast 20 Characters or less"
								)
								.required("This Field is Required")
								.when("new_password", {
									is: (val) =>
										val && val.length > 0 ? true : false,
									then: Yup.string().oneOf(
										[Yup.ref("new_password")],
										"Password does not match"
									),
								}),
						})}
						onSubmit={(
							{ current_password, new_password },
							{ setSubmitting, resetForm, setFieldError }
						) => {
							axios
								.post(
									backendHost +
										"/api/authentication/users/set_password/",
									{
										current_password,
										new_password,
									}
								)
								.then((res) => {
									resetForm();
									setSubmitting(false);
									onClose();
									toast({
										title: "Password Successfully Changed",
										status: "success",
										duration: 20000,
										isClosable: true,
									});
								})
								.catch(({ response }) => {
									let errors = response.data;
									let errorKeys = Object.keys(errors);
									errorKeys.map((val) => {
										if (Array.isArray(errors[val])) {
											setFieldError(val, errors[val][0]);
											return null;
										} else {
											setFieldError(val, errors[val]);
											return null;
										}
									});
									setSubmitting(false);
								});
						}}
					>
						{(props) => (
							<Form>
								<ModalBody>
									<MyFormTextInput
										label="当前密码"
										name="current_password"
										type="password"
										icon={FaKey}
										placeholder="当前密码"
									/>
									<MyFormTextInput
										label="新密码"
										name="new_password"
										type="password"
										icon={FaKey}
										placeholder="新密码"
									/>
									<MyFormTextInput
										label="确认新密码"
										name="confirm_new_password"
										type="password"
										icon={FaKey}
										placeholder="确认新密码"
									/>
								</ModalBody>
								<ModalFooter>
									<Button
										isLoading={props.isSubmitting}
										type="submit"
										mr={3}
										colorScheme="orange"
									>
										更改密码
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

export default ChangePasswordModal;
