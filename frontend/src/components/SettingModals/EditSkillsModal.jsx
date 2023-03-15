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
	Link,
	Icon,
	useToast,
} from "@chakra-ui/react";
import * as Yup from "yup";
import { Formik, Form } from "formik";
import { FaPencilAlt } from "react-icons/fa";
import axios from "axios";
import { backendHost } from "../../config";
import { useContext } from "react";
import { userContext } from "../../stores/User";
import MyFormTextareaInput from "../TextFields/MyFormTextAreaInput";
import { UpdateSkills } from "../../stores/actions/UserActions";

const EditSkillsModal = () => {
	const [user, userDispatch] = useContext(userContext);
	const { isOpen, onOpen, onClose } = useDisclosure();
	const toast = useToast();

	return (
		<>
			<Link onClick={onOpen} pl={2}>
				<Icon as={FaPencilAlt} /> 编辑
			</Link>

			<Modal isOpen={isOpen} onClose={onClose} size="xl">
				<ModalOverlay />
				<ModalContent onTouchCancel={(e) => e.preventDefault()}>
					<ModalHeader>编辑技能</ModalHeader>
					<ModalCloseButton />
					<Formik
						initialValues={{
							skills: user.profile.skills
								? user.profile.skills.toString()
								: "",
						}}
						validationSchema={Yup.object({
							skills: Yup.string()
								.max(
									100,
									"最多100个字符"
								)
								.required("不能为空"),
						})}
						onSubmit={(
							{ skills },
							{ setSubmitting, resetForm, setFieldError }
						) => {
							let skillsArray = skills.split(",");
							axios
								.put(backendHost + "/api/users/skills/", {
									skills: skillsArray,
								})
								.then((res) => {
									resetForm();
									setSubmitting(false);
									onClose();
									userDispatch(UpdateSkills(skillsArray));
									toast({
										title: "成功更新技能",
										status: "success",
										duration: 20000,
										isClosable: true,
									});
								})
								.catch((err) => {
									setSubmitting(false);
									setFieldError("skills", "Error Occured");
								});
						}}
					>
						{(props) => (
							<Form>
								<ModalBody>
									<MyFormTextareaInput
										label="技能"
										name="skills"
										placeholder="技能"
										helpText="用逗号分隔每个技能"
										maxLength={100}
									/>
								</ModalBody>
								<ModalFooter>
									<Button
										isLoading={props.isSubmitting}
										type="submit"
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

export default EditSkillsModal;
