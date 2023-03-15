import MarkdownEditor from "@uiw/react-markdown-editor";
import {
	FormControl,
	FormLabel,
	FormErrorMessage,
	InputGroup,
	FormHelperText,
    Box,
} from "@chakra-ui/react";
import React from "react";
import { useField } from "formik";

const MyFormMarkdownInput = ({ label, helpText, ...props }) => {
	const [field, meta] = useField(props);
	return (
		<Box maxW="100%">
			<FormControl
				mt={2}
				isInvalid={
					meta.touched && meta.error ? <div>{meta.error}</div> : null
				}
			>
				<FormLabel htmlFor={props.id || props.name}>{label}</FormLabel>
                <MarkdownEditor style={{width: '100%'}} {...field} {...props} />
					
				<FormErrorMessage>
					{meta.touched && meta.error ? meta.error : null}
				</FormErrorMessage>
				<FormHelperText>{helpText ? helpText : null}</FormHelperText>
			</FormControl>
		</Box>
	);
};

export default MyFormMarkdownInput;