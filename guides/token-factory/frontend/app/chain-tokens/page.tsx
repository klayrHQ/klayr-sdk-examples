import {
	Box, Button, IconButton,
	Stack,
	Table,
	TableBody,
	TableCell,
	TableCellProps,
	TableHead,
	TableRow,
	Typography,
} from '@mui/material';
import { ReactElement } from 'react';
import { Settings } from '@mui/icons-material';

interface column {
	value: string | ReactElement
	props?: TableCellProps
}

type columns = column[]

type rows = columns[]
const Page = () => {
	const rows: rows = [
		[
			{value: "KlayrToken"},
			{value: "KLY"},
			{value: "Klayr"},
			{value: "5.000", props: {align: "right"}},
			{value: <IconButton><Settings /></IconButton>, props: {sx: {width: "50px"}}},
		]
	]
	const headColumns: columns = [
		{ value: 'Token', props: {size: "small"}},
		{ value: 'Symbol', props: {size: "small"}},
		{ value: 'Creator', props: {size: "medium"}},
		{ value: 'Amount', props: {size: "medium", align: "right"}},
		{ value: ""},
	]

	return (
		<Box sx={{maxWidth: "90%", width: {xs: "auto", lg: "1150px"}, marginInline: "auto"}}>
			<Stack>
				<Typography component={"h1"} variant={"h1"}>
					Owned Tokens
				</Typography>
				<Typography component={"span"}>
					All tokens in your wallet
				</Typography>
				<Table sx={{mt: "100px"}}>
					<TableHead>
						<TableRow>
							{headColumns.map(({ value, props }, column) => {
								return (
									<TableCell key={`head-column-${column + 1}`} variant={'head'} sx={{fontSize: "small"}} {...props}>
										{value}
									</TableCell>
								);
							})}
						</TableRow>
					</TableHead>
					<TableBody>
						{
							rows.map((columns, row) => (
								<TableRow key={`row-${row + 1}`}>
									{
										columns.map(({value, props}, column) => (
											<TableCell key={`row-${row + 1}-column-${column + 1}`} variant={"body"} {...props}>
												{value}
											</TableCell>
										))
									}
								</TableRow>
							))
						}
					</TableBody>
				</Table>
			</Stack>
		</Box>
	)
}

export default Page;