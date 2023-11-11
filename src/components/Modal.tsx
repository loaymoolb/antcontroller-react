import { Box, Button, Typography, Modal } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'

interface ModalComponentProps {
    open: boolean;
    close: () => void;
    heading?: string;
    subheading?: string;
    submit: () => void;
}

const ModalComponent: React.FC<ModalComponentProps> = ({ open, close, heading, subheading, submit }) => {  return (
    <Modal open={open} onClose={close}>
        <Box sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            width: 300,
            borderRadius: 2
        }}>
            <Button 
                sx={{ position: 'absolute', top: 8, right: 8, minWidth: 'auto' }}
                onClick={close}
            >
                <CloseIcon />
            </Button>
            {heading && <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
                {heading}
            </Typography>}
            {subheading && <Typography sx={{ my: 4 }}>
                {subheading}
            </Typography>}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', mt: 2 }}>
                <Button variant="outlined" onClick={close}>Close</Button>
                <Button variant="contained" onClick={submit}>Submit</Button>
            </Box>
        </Box>
  </Modal>
  )
}

export default ModalComponent