import { useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, List, ListItem, ListItemText, IconButton, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPersons, showNotification } from '../store/groupSlice';
import api from '../api/axios';

const PersonListModal = ({ open, onClose }) => {
    const dispatch = useDispatch();
    const persons = useSelector(state => state.groups.persons);

    useEffect(() => {
        if (open) {
            dispatch(fetchPersons());
        }
    }, [open, dispatch]);

    const handleDeletePerson = async (id) => {
        if (!window.confirm('Точно удалить этого администратора?')) return;
        try {
            await api.delete(`/persons/${id}`);
            dispatch(showNotification({ message: 'Администратор удален', severity: 'success' }));
            dispatch(fetchPersons());
        } catch (error) {
            dispatch(showNotification({ message: 'Не удалось удалить (возможно он привязан к группе)', severity: 'error' }));
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Список администраторов</DialogTitle>
            <DialogContent>
                {persons.length === 0 ? (
                    <Typography variant="body1" sx={{ mt: 2 }}>Администраторы пока не добавлены.</Typography>
                ) : (
                    <List dense>
                        {persons.map(p => (
                            <ListItem key={p.id} secondaryAction={
                                <IconButton edge="end" color="error" onClick={() => handleDeletePerson(p.id)}>
                                    <DeleteIcon />
                                </IconButton>
                            }>
                                <ListItemText primary={p.name} secondary={`ID: ${p.id} | Родился: ${p.birthday}`} />
                            </ListItem>
                        ))}
                    </List>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Закрыть</Button>
            </DialogActions>
        </Dialog>
    );
};

export default PersonListModal;