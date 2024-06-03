import { TableCellProps } from '@mui/material';
import { ReactElement } from 'react';

export interface IColumn {
	value: string | ReactElement
	props?: TableCellProps
}

export type ColumnsType = IColumn[]

export type RowsType = ColumnsType[]

export interface IToken {
	tokenID: string,
	owner: string,
	name: string,
	symbol: string,
	totalSupply: string,
	blockHeight: number
}

export interface ITokenActionsProps {
	tokenID: string
	tokenName?: string
}

export interface ITransactionFormProps {
	amount?: string
	tokenID: string
	recipients?: {recipient: string, amount: string}[]
}