import React, { useContext } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Text, Box, Button } from "@chakra-ui/react";

import LoginSVG from "../assets/svgs/Login.svg";

import MyFormTextInput from "../components/TextFields/MyFormTextInput";
import BaseFormSVG from "../components/BaseFormSVG";
import { tokenContext } from "../stores/Token";
import { Redirect } from "react-router";
import axios from "axios";
import { backendHost } from "../config";
import TextLink from "../components/TextLink";
import { FaUserAlt, FaKey, FaSignInAlt } from "react-icons/fa";
import { Helmet } from "react-helmet";

const Login = () => {
	const [token, setToken] = useContext(tokenContext);
	return token === null ? (
		<BaseFormSVG svg={LoginSVG}>
			<Helmet>
				<title>登录 - 校园博客论坛</title>
			</Helmet>
			<Formik
				initialValues={{
					username: "",
					password: "",
				}}
				validationSchema={Yup.object({
					username: Yup.string()
						.min(3, "最少3个字符")
						.max(12, "最多12个字符")
						.required("用户名不能为空"),
					password: Yup.string()
						.min(8, "最少8个字符")
						.max(20, "最多20个字符")
						.required("密码不能为空"),
				})}
				onSubmit={(
					{ username, password },
					{ setSubmitting, resetForm, setFieldError }
				) => {
					axios
						.post(backendHost + "/api/token/", {
							username,
							password,
						})
						.then((res) => {
							setSubmitting(false);
							resetForm();
							if (res.status === 200) {
								setToken(res.data);
							}
						})
						.catch(({ response }) => {
							axios
								.get(
									backendHost +
										`/api/users/is-user-active/${username}/`
								)
								.then((res) => {
									if (res.data.is_active === false) {
										axios
											.post(
												backendHost +
													"/api/authentication/users/resend_activation/",
												{
													email: res.data.email,
												}
											)
											.then((res) => {
												if (res.status === 204) {
													setFieldError(
														"username",
														"Your Email is not verified! We have resent verification email"
													);
												}
											});
									} else {
										if (response) {
											let error = response.data?.detail;
											setFieldError("username", error);
										}
									}
								})
								.catch(({ response }) => {
									if (response) {
										let error = response.data?.detail;
										setFieldError("username", error);
									}
								});
							setSubmitting(false);
						});
				}}
			>
				{(props) => (
					<Form>
						<MyFormTextInput
							label="用户名"
							name="username"
							icon={FaUserAlt}
							placeholder="用户名"
						/>
						<MyFormTextInput
							label="密码"
							name="password"
							type="password"
							icon={FaKey}
							placeholder="密码"
						/>
						<Text mt={4}>
							还没有账户?{" "}
							<TextLink text="注册" to="/signup" />
						</Text>
						<Button
							mt={4}
							isLoading={props.isSubmitting}
							type="submit"
							isFullWidth={true}
							leftIcon={<FaSignInAlt />}
						>
							登录
						</Button>
						<Box mt={4}>
							<TextLink
								text="忘记密码?"
								to="/forget-password"
							/>
						</Box>
					</Form>
				)}
			</Formik>
		</BaseFormSVG>
	) : (
		<Redirect to="/" />
	);
};

export default Login;
