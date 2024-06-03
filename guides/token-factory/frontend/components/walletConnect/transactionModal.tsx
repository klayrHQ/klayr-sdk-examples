import { CommandType, TransactionStatus } from '@/types/transactions';
import { Box, Button, IconButton, Modal, Stack, Typography } from '@mui/material';
import { MouseEventHandler, useEffect, useState } from 'react';
import { Close } from '@mui/icons-material';

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

    const handleClose = (event: React.MouseEvent) => {
        onClose;
    };

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
            <Box className={"flex items-center justify-center w-[400px] h-[300px] absolute inset-0 m-auto rounded-xl"} sx={{backgroundColor: "background.default"}}>
                {
                    modalType === "status" ?
                        <Stack className={"justify-center items-center"}>
                            <Typography variant='h2'>{stateText}</Typography>
                            {
                                status === TransactionStatus.PENDING && <Typography>Sign transaction in your wallet</Typography>
                            }
                            {
                                status === TransactionStatus.FAILURE && <Typography>You can close this window and try again</Typography>
                            }
                            {
                              status === TransactionStatus.SUCCESS && <Typography>You can close this window</Typography>
                            }
                        </Stack>
                        : <Stack className={"gap-8"}>
                              <Typography variant="h2">Confirm Transaction</Typography>
                              <Button onClick={onApprove}><Typography>Approve</Typography></Button>
                          </Stack>
                }
                <IconButton className={"absolute right-2 top-2"} onClick={handleClose}>
                    <Close />
                </IconButton>
            </Box>
        </Modal>
    )
}