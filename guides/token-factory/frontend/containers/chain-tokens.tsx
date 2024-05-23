"use client"
import {
	Box,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
} from '@mui/material';
import { PageLayout } from '@/components/layout/pageLayout';
import { ColumnsType, IToken, RowsType } from '@/types/types';
import { useEffect, useState } from 'react';
import { getTokens } from '@/utils/api';

export const ChainTokens = () => {
	const [tokens, setTokens] = useState<IToken[]>();

	useEffect(() => {
		const setTokensFromApi = async () => {
			const response = await getTokens();

			setTokens(response);
		}

		setTokensFromApi();
	}, [])

	// @ts-ignore
	const rows: RowsType | undefined = tokens?.map((token) => {
		return [
			{ value: token.tokenID },
			{ value: token.name },
			{ value: token.symbol },
			{ value: `${token.owner.substring(0,10)}...` },
			{ value: token.totalSupply, props: { align: 'right' } },
		]
	})

	const headColumns: ColumnsType = [
		{ value: 'Token ID', props: {size: "small"}},
		{ value: 'Token', props: {size: "small"}},
		{ value: 'Symbol', props: {size: "small"}},
		{ value: 'Owner', props: {size: "medium"}},
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
							rows ? rows.map((columns, row) => (
								<TableRow key={`row-${row + 1}`}>
									{
										columns.map(({value, props}, column) => (
											<TableCell key={`row-${row + 1}-column-${column + 1}`} variant={"body"} {...props}>
												{value}
											</TableCell>
										))
									}
								</TableRow>
							)) :
								<TableRow>
									<TableCell variant={"body"} align={"center"} colspan={5}>
										No tokens found...
									</TableCell>
								</TableRow>
						}
					</TableBody>
				</Table>
			</Box>
		</PageLayout>
	)
}