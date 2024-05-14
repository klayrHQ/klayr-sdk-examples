import {
	Box,
	Stack,
	Table,
	TableBody,
	TableCell,
	TableCellProps,
	TableHead,
	TableRow,
	Typography,
} from '@mui/material';
import { PageLayout } from '@/components/layout/pageLayout';

interface column {
	value: string
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
			{value: "5.000.000", props: {align: "right"}}
		],
		[
			{value: "FactoryToken"},
			{value: "FTK"},
			{value: "Klayr"},
			{value: "2.500.000", props: {align: "right"}}
		]
	]
	const headColumns: columns = [
		{ value: 'Token', props: {size: "small"}},
		{ value: 'Symbol', props: {size: "small"}},
		{ value: 'Creator', props: {size: "medium"}},
		{ value: 'Amount on chain', props: {size: "medium", align: "right"}}
	]

	return (
		<PageLayout title={"Tokens"} subTitle={"All tokens on the sidechain"}>
			<Box className={"w-full overflow-x-auto"}>
				<Table className={'w-full overflow-x-auto'}>
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
			</Box>
		</PageLayout>
	)
}

export default Page;