import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';

const Header = ({ onOpenGroup, onOpenPerson, onOpenPersonList }) => {
    return (
        <AppBar position="static" sx={{ mb: 4 }}>
            <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    Управление учебными группами
                </Typography>
                <Box gap={2} display="flex">
                    <Button color="inherit" variant="outlined" onClick={onOpenPersonList}>
                        Список администраторов
                    </Button>
                    <Button color="inherit" variant="outlined" onClick={onOpenPerson}>
                        Добавить администратора
                    </Button>
                    <Button color="inherit" variant="outlined" onClick={onOpenGroup}>
                        Создать группу
                    </Button>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Header;