import { Typography } from '@mui/material';
import { SubmitErrorHandler } from 'react-hook-form';
import { ITransactionFormProps } from '@/types/types';

export const returnIfString = (value: unknown) => {
	if (typeof value !== "string") return undefined;
	else return value;
}

export const cls = (classes: Array<undefined | null | boolean | string>) => classes.filter(Boolean).join(" ");

export const getErrorText = (errorType: string | undefined, fieldType?: string | undefined) => {
	let errorText = "Unknown input error";

	if (errorType === "required") errorText = "This field is required";

	if (errorType === "pattern") {
		if(fieldType === "number") {
			errorText = "This field only accepts numbers";
		} else {
			errorText = "Invalid input";
		}
	}

	return <Typography className={"text-xs text-[#FF422D] mt-1"}>{errorText}</Typography>;
}

export const onError: SubmitErrorHandler<ITransactionFormProps> = () => {
	return;
}