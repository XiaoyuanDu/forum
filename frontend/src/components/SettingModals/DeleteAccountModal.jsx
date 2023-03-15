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
import { DeleteIcon } from "@chakra-ui/icons";
import MyFormTextInput from "../TextFields/MyFormTextInput";
import { DeleteUserState } from "../../stores/actions/UserActions";
import { useContext } from "react";
import { userContext } from "../../stores/User";
import { tokenContext } from "../../stores/Token";

const DeleteAccountModal = () => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [, userDispatch] = useContext(userContext);
	const [, setToken] = useContext(tokenContext);
	const toast = useToast();

	return (
		<>
			<Button
				onClick={onOpen}
				mt={2}
				leftIcon={<DeleteIcon />}
				colorScheme="red"
			>
				注销账户
			</Button>

			<Modal isOpen={isOpen} onClose={onClose} size="xl">
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>注销账户</ModalHeader>
					<ModalCloseButton />
					<Formik
						initialValues={{
							current_password: "",
						}}
						validationSchema={Yup.object({
							current_password: Yup.string()
								.min(8, "Must be atleast 8 characters")
								.max(
									20,
									"Must be Atleast 20 Characters or less"
								)
								.required("This Field is Required"),
						})}
						onSubmit={(
							{ current_password },
							{ setSubmitting, resetForm, setFieldError }
						) => {
							let req = axios.delete(
								backendHost + "/api/authentication/users/me/",
								{
									data: {
										current_password,
									},
								}
							);

							req.then((res) => {
								userDispatch(DeleteUserState());
								setToken(null);
								toast({
									title: "Account Deleted",
									status: "error",
									duration: 20000,
									isClosable: true,
								});
								resetForm();
								setSubmitting(false);
								onClose();
							}).catch(({ response }) => {
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
								</ModalBody>
								<ModalFooter>
									<Button
										isLoading={props.isSubmitting}
										type="submit"
										mr={3}
										colorScheme="red"
									>
										注销账户
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

export default DeleteAccountModal;
