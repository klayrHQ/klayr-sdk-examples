"use client"
import { Box, Button, Modal, Tab, Tabs, Typography } from '@mui/material';
import { Mint, Burn, Transfer, BatchTransfer } from '@/components/tokens/actions';
import { SyntheticEvent, useState } from 'react';
import { Settings } from '@mui/icons-material';

function a11yProps(index: number) {
	return {
		id: `simple-tab-${index}`,
		'aria-controls': `simple-tabpanel-${index}`,
	};
}

export const TokenActionsModal = ({tokenID, tokenName}: { tokenID: string, tokenName: string }) => {
	const [modalOpen, setModalOpen] = useState(false);
	const [currentTab, setCurrentTab] = useState(0);

	const toggleModal = () => {
		setModalOpen(!modalOpen);
	}

	const props = {tokenID: tokenID, tokenName: tokenName}

	const tabs = [
		{
			name: "Mint",
			content: <Mint {...props} />,
		},
		{
			name: "Burn",
			content: <Burn {...props} />,
		},
		{
			name: "Transfer",
			content: <Transfer {...props} />,
		},
		{
			name: "Batch Transfer",
			content: <BatchTransfer {...props} />,
		},
	]

	return (
		<Box>
			<Button onClick={toggleModal}>
				<Settings />
				<Typography className={"ml-2"}>Manage</Typography>
			</Button>
			<Modal open={modalOpen} onClose={toggleModal}>
				<Box className={"max-w-[90%] w-[800px] h-[400px] rounded-xl flex flex-col absolute inset-0 m-auto overflow-hidden"} sx={{backgroundColor: "background.default"}}>
					<Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
						<Tabs
							value={currentTab}
							onChange={(event: SyntheticEvent, newValue: number) => setCurrentTab(newValue)}
							aria-label="transaction tabs"
						>
							{
								tabs.map(({ name }, index) => (
									<Tab className={"pt-4"} label={name} key={`tab-${name}`} {...a11yProps(index)} />
								))
							}
						</Tabs>
					</Box>
					<Box className={"h-full w-full overflow-y-auto p-8"}>
						{tabs[currentTab].content}
					</Box>
				</Box>
			</Modal>
		</Box>
	)
}