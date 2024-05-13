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
import { PageLayout } from '@/components/layout/pageLayout';
import { TokenActionsModal } from '@/components/tokens/tokenActionsModal';

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
			{value: <TokenActionsModal tokenName={"KlayrToken"} tokenID={"1234567800000001"}/>, props: {sx: {width: "50px"}}},
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
		<PageLayout
			title={"Owned Tokens"}
			subTitle={"All tokens in your wallet"}
		>
			<Table>
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
		</PageLayout>
	)
}

export default Page;