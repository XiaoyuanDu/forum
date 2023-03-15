import React, { useContext } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Button, Text, useToast } from "@chakra-ui/react";

import SignupSVG from "../assets/svgs/Signup.svg";

import MyFormTextInput from "../components/TextFields/MyFormTextInput";
import BaseFormSVG from "../components/BaseFormSVG";
import { tokenContext } from "../stores/Token";
import { Redirect } from "react-router";
import axios from "axios";
import { backendHost } from "../config";
import TextLink from "../components/TextLink";
import { FaUserAlt, FaEnvelope, FaKey, FaUserPlus } from "react-icons/fa";
import { Helmet } from "react-helmet";

const Signup = () => {
	const [token] = useContext(tokenContext);
	const toast = useToast();
	return token === null ? (
		<BaseFormSVG svg={SignupSVG}>
			<Helmet>
				<title>Signup - Technota</title>
			</Helmet>
			<Formik
				initialValues={{
					username: "",
					email: "",
					password: "",
					confirm_password: "",
				}}
				validationSchema={Yup.object({
					username: Yup.string()
						.min(3, "最少3个字符")
						.max(12, "最多12个字符")
						.required("用户名不能为空"),
					email: Yup.string()
						.email("无效的邮箱地址")
						.required("邮箱地址不能为空"),
					password: Yup.string()
						.min(8, "最少8个字符")
						.max(20, "最多20个字符")
						.required("密码不能为空"),
					confirm_password: Yup.string()
						.min(8, "最少8个字符")
						.max(20, "最多20个字符")
						.required("确认密码不能为空")
						.when("password", {
							is: (val) => (val && val.length > 0 ? true : false),
							then: Yup.string().oneOf(
								[Yup.ref("password")],
								"两次输入密码不一致！"
							),
						}),
				})}
				onSubmit={(
					{ username, email, password },
					{ setSubmitting, resetForm, setFieldError }
				) => {
					axios
						.post(backendHost + "/api/authentication/users/", {
							username,
							email,
							password,
						})
						.then((res) => {
							if (res.status === 201) {
								resetForm();
							}
							setSubmitting(false);
						})
						.catch(({ response }) => {
							if (response) {
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
							}
							setSubmitting(false);
						});
				}}
			>
				{(props) => (
					<Form>
						<MyFormTextInput
							label="用户名"
							icon={FaUserAlt}
							name="username"
							placeholder="用户名"
						/>
						<MyFormTextInput
							label="邮箱"
							name="email"
							icon={FaEnvelope}
							placeholder="example@example.com"
						/>
						<MyFormTextInput
							label="密码"
							name="password"
							type="password"
							icon={FaKey}
							placeholder="密码"
						/>
						<MyFormTextInput
							label="确认密码"
							name="confirm_password"
							type="password"
							icon={FaKey}
							placeholder="确认密码"
						/>
						<Text mt={4}>
							已经有账户了?{" "}
							<TextLink text="登录" to="/login" />
						</Text>
						<Button
							mt={4}
							isLoading={props.isSubmitting}
							type="submit"
							isFullWidth={true}
							leftIcon={<FaUserPlus />}
						>
							注册
						</Button>
					</Form>
				)}
			</Formik>
		</BaseFormSVG>
	) : (
		<Redirect to="/" />
	);
};

export default Signup;
