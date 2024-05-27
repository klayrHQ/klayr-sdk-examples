"use client"
import {
	Box,
	Stack,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
	Typography,
} from '@mui/material';
import { PageLayout } from '@/components/layout/pageLayout';
import { TokenActionsModal } from '@/components/tokens/tokenActionsModal';
import { ColumnsType, IToken, RowsType } from '@/types/types';
import { useWalletConnect } from '@/providers/walletConnectProvider';
import { useEffect, useState } from 'react';
import { getTokens } from '@/utils/api';
import { ConnectWalletButton } from '@/components/walletConnect/connectWalletButton';

export const OwnedTokens = () => {
	const { account } = useWalletConnect()
	const [tokens, setTokens] = useState<IToken[]>();

	useEffect(() => {
		const setTokensFromApi = async () => {
			const response = await getTokens(account?.address);

			if(account?.address) {
				setTokens(response);
			}
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
			{value: <TokenActionsModal tokenName={token.name} tokenID={token.tokenID}/>, props: {sx: {width: "50px"}}},
		]
	})

	const headColumns: ColumnsType = [
		{ value: 'Token ID', props: {size: "small"}},
		{ value: 'Token', props: {size: "small"}},
		{ value: 'Symbol', props: {size: "small"}},
		{ value: 'Owner', props: {size: "medium"}},
		{ value: 'Amount', props: {size: "medium", align: "right"}},
		{ value: ""},
	]

	return (
		<PageLayout
			title={"Owned Tokens"}
			subTitle={"All tokens in your wallet"}
		>
			<Box className={"w-full overflow-x-auto"}>
				<Table className={'w-full overflow-x-auto'}>
					<TableHead>
						<TableRow>
							{headColumns.map(({ value, props }, column) => {
								return (
									<TableCell key={`head-column-${column + 1}`} variant={'head'} sx={{ fontSize: 'small' }} {...props}>
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
										columns.map(({ value, props }, column) => (
											<TableCell key={`row-${row + 1}-column-${column + 1}`} variant={'body'} {...props}>
												{value}
											</TableCell>
										))
									}
								</TableRow>
							)) :
								<TableRow>
									<TableCell variant={"body"} align={"center"} colSpan={6}>
										<Stack className={"gap-4"}>
											<Typography>No tokens found...</Typography>
											{
												!account?.address && <ConnectWalletButton buttonClassName={"mx-auto"} />
											}
										</Stack>
									</TableCell>
								</TableRow>
						}
					</TableBody>
				</Table>
			</Box>
		</PageLayout>
	)
}