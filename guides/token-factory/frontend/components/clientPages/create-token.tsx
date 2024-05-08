"use client"
import { Button, Input, InputLabel, Stack, Typography } from '@mui/material';
import { PageLayout } from '@/components/layout/pageLayout';
import { SubmitErrorHandler, SubmitHandler, useForm } from 'react-hook-form';

interface CreateTokenProps {
	name: string
	symbol: string
	totalSupply: number
}

export const CreateToken = () => {
	const { register, handleSubmit, formState: { errors } } = useForm();

	const onSubmit: SubmitHandler<CreateTokenProps> = (data) => console.log(data);
	const onError: SubmitErrorHandler<CreateTokenProps> = (errors) => console.log(errors);

	const getErrorText = (errorType: string, fieldType?: string | undefined) => {
		let errorText = "";

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

	return (
		<PageLayout title={"Create Token"} subTitle={"Create your own token"}>
			<form className={"w-[350px] md:w-[500px]"}>
				<Stack className={"gap-4"}>
					<InputLabel className={"w-full"}>
						<Typography>Token Name:</Typography>
						<Input
							className={"w-full"}
							type={'text'}
							error={!!errors.name}
							placeholder={"Example Token"}
							{...register("name", { required: true })}
						/>
						{errors.name && getErrorText(errors.name.type)}
					</InputLabel>
					<InputLabel className={'w-full'}>
						<Typography>Token Symbol:</Typography>
						<Input
							className={'w-full'}
							type={'text'}
							error={!!errors.symbol}
							placeholder={"TKN"}
							{...register('symbol', { required: true })}
						/>
						{errors.symbol && getErrorText(errors.symbol.type)}
					</InputLabel>
					<InputLabel className={"w-full"}>
						<Typography>Total Supply:</Typography>
						<Input
							className={"w-full"}
							type={'text'}
							error={!!errors.totalSupply}
							placeholder={"10000"}
							{...register("totalSupply", { required: true, pattern: /^[0-9]+$/i })}
						/>
						{errors.totalSupply && getErrorText(errors.totalSupply.type, "number")}
					</InputLabel>
					<Button onClick={handleSubmit(onSubmit, onError)}>Submit</Button>
				</Stack>
			</form>
		</PageLayout>
	)
}