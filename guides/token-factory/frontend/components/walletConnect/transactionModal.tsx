import { CommandType, TransactionStatus } from "@/types/transactions"
import { Modal, Typography, Box, Button } from "@mui/material"
import { useEffect, useState } from "react"

interface TransactionModalProps {
    open: boolean
    onClose: (open: boolean) => void
    status?: TransactionStatus
    type: CommandType
    onApprove: () => void
    modalType: "status" | "approve"
}

export const TransactionModal = ({open, onClose, type, status, onApprove, modalType}: TransactionModalProps) => {
    const [stateText, setStateText] = useState<string>('');

    useEffect(() => {
        switch(type) {
            case "createToken": 
                setStateText('Creating token...');
                if (status === TransactionStatus.SUCCESS) {
                setStateText('Token created');
                }
                if (status === TransactionStatus.FAILURE) {
                setStateText('Failed to create token');
                }
                break;

            case "mint": 
                setStateText('Minting tokens...');
                if (status === TransactionStatus.SUCCESS) {
                setStateText('Tokens minted');
                }
                if (status === TransactionStatus.FAILURE) {
                setStateText('Failed to mint tokens');
                }
                break;

            case "burn": 
                setStateText('Burning tokens...');
                if (status === TransactionStatus.SUCCESS) {
                setStateText('Tokens burned');
                }
                if (status === TransactionStatus.FAILURE) {
                setStateText('Failed to burn tokens');
                }
                break;

            case "batchTransfer": 
                setStateText('Transfering tokens...');
                if (status === TransactionStatus.SUCCESS) {
                setStateText('Tokens transfered');
                }
                if (status === TransactionStatus.FAILURE) {
                setStateText('Failed to transfer tokens');
                }
                break;
        }
      }, [type, status]);

    return (
        <Modal open={open} onClose={onClose}>
            <Box className={"flex items-center justify-center w-[400px] h-[300px]"}>
                {
                    modalType === "status" ? 
                        <Typography variant="h2">{stateText}</Typography> 
                        : <Button onClick={onApprove}>Approve</Button>
                }
            </Box>
        </Modal>
    )
}