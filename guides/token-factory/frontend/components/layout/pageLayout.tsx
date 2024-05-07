import { ReactNode } from 'react';
import { Box, Stack, SxProps, Typography } from '@mui/material';
import { cls } from '@/utils/functions';

export const PageLayout = ({
	children,
	title,
	subTitle,
	containerClassName
}: {
	children?: ReactNode,
	title?: string,
	subTitle?: string,
	containerClassName?: string
	containerSx?: SxProps
}) => {
	return (
		<Box className={cls([
			"max-w-[90%] lg:w-1150px mx-auto",
			containerClassName,
		])}>
			<Stack className={"gap-20"}>
				<Stack>
					{
						title &&
						<Typography component={'h1'} variant={'h1'}>
							{title}
						</Typography>
					}
					{
						subTitle &&
						<Typography component={'span'}>
							{subTitle}
						</Typography>
					}
				</Stack>
				{children}
			</Stack>
		</Box>
	)
}