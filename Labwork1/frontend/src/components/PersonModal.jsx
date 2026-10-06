import { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Typography,
    Box
} from '@mui/material';
import { useDispatch } from 'react-redux';
import { fetchPersons, showNotification } from '../store/groupSlice';
import api from '../api/axios';

const initialForm = {
    name: '',
    birthday: '',
    eyeColor: '',
    hairColor: '',
    nationality: '',
    locationX: '',
    locationY: '',
    locationName: ''
};

const PersonModal = ({ open, onClose }) => {
    const dispatch = useDispatch();
    const [formData, setFormData] = useState(initialForm);
    const [isDateFocused, setIsDateFocused] = useState(false);

    const showDatePicker = isDateFocused || Boolean(formData.birthday);

    const handleSubmit = async event => {
        event.preventDefault();

        if (!formData.name.trim()) {
            dispatch(showNotification({
                message: 'Имя администратора не может быть пустым',
                severity: 'error'
            }));
            return;
        }

        if (!formData.birthday) {
            dispatch(showNotification({
                message: 'Дата рождения обязательна',
                severity: 'error'
            }));
            return;
        }

        if (!formData.hairColor) {
            dispatch(showNotification({
                message: 'Цвет волос обязателен',
                severity: 'error'
            }));
            return;
        }

        const locationX = formData.locationX.trim();
        const locationY = formData.locationY.trim();
        const locationName = formData.locationName.trim();
        const locationFilled = locationX !== '' || locationY !== '' || locationName !== '';

        if (locationFilled && (locationX === '' || locationY === '' || locationName === '')) {
            dispatch(showNotification({
                message: 'Если указана локация, необходимо заполнить X, Y и название',
                severity: 'error'
            }));
            return;
        }

        if (locationFilled) {
            const x = Number(locationX);
            const y = Number(locationY);

            if (!Number.isFinite(x)) {
                dispatch(showNotification({
                    message: 'Координата X локации должна быть числом',
                    severity: 'error'
                }));
                return;
            }

            if (!Number.isInteger(y)) {
                dispatch(showNotification({
                    message: 'Координата Y локации должна быть целым числом',
                    severity: 'error'
                }));
                return;
            }
        }

        const payload = {
            name: formData.name.trim(),
            birthday: formData.birthday,
            eyeColor: formData.eyeColor || null,
            hairColor: formData.hairColor,
            nationality: formData.nationality || null,
            location: locationFilled
                ? {
                    x: Number(locationX),
                    y: Number(locationY),
                    name: locationName
                }
                : null
        };

        try {
            await api.post('/persons', payload);

            dispatch(showNotification({
                message: 'Администратор добавлен',
                severity: 'success'
            }));

            dispatch(fetchPersons());
            setFormData(initialForm);
            onClose();
        } catch (error) {
            const data = error.response?.data;
            const message = data
                ? (data.error || Object.values(data).join(' | '))
                : (error.message || 'Ошибка сервера');

            dispatch(showNotification({
                message: 'Ошибка: ' + message,
                severity: 'error'
            }));
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Добавление администратора</DialogTitle>

            <form onSubmit={handleSubmit}>
                <DialogContent
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2,
                        pt: 2
                    }}
                >
                    <TextField
                        label="Имя"
                        required
                        value={formData.name}
                        onChange={e =>
                            setFormData({
                                ...formData,
                                name: e.target.value
                            })
                        }
                    />

                    <TextField
                        label="Дата рождения"
                        type={showDatePicker ? 'date' : 'text'}
                        required
                        value={formData.birthday}
                        onChange={e =>
                            setFormData({
                                ...formData,
                                birthday: e.target.value
                            })
                        }
                        onFocus={() => setIsDateFocused(true)}
                        onBlur={() => setIsDateFocused(false)}
                        InputLabelProps={{ shrink: showDatePicker }}
                    />

                    <FormControl required>
                        <InputLabel id="hair-color-label">Цвет волос</InputLabel>
                        <Select
                            labelId="hair-color-label"
                            value={formData.hairColor}
                            label="Цвет волос"
                            onChange={e =>
                                setFormData({
                                    ...formData,
                                    hairColor: e.target.value
                                })
                            }
                        >
                            <MenuItem value="">Выберите цвет</MenuItem>
                            <MenuItem value="GREEN">GREEN</MenuItem>
                            <MenuItem value="BLACK">BLACK</MenuItem>
                            <MenuItem value="ORANGE">ORANGE</MenuItem>
                            <MenuItem value="WHITE">WHITE</MenuItem>
                            <MenuItem value="BROWN">BROWN</MenuItem>
                        </Select>
                    </FormControl>

                    <FormControl>
                        <InputLabel id="eye-color-label">Цвет глаз</InputLabel>
                        <Select
                            labelId="eye-color-label"
                            value={formData.eyeColor}
                            label="Цвет глаз"
                            onChange={e =>
                                setFormData({
                                    ...formData,
                                    eyeColor: e.target.value
                                })
                            }
                        >
                            <MenuItem value=""><em>Нет</em></MenuItem>
                            <MenuItem value="GREEN">GREEN</MenuItem>
                            <MenuItem value="BLACK">BLACK</MenuItem>
                            <MenuItem value="ORANGE">ORANGE</MenuItem>
                            <MenuItem value="WHITE">WHITE</MenuItem>
                            <MenuItem value="BROWN">BROWN</MenuItem>
                        </Select>
                    </FormControl>

                    <FormControl>
                        <InputLabel id="nationality-label">Национальность</InputLabel>
                        <Select
                            labelId="nationality-label"
                            value={formData.nationality}
                            label="Национальность"
                            onChange={e =>
                                setFormData({
                                    ...formData,
                                    nationality: e.target.value
                                })
                            }
                        >
                            <MenuItem value=""><em>Нет</em></MenuItem>
                            <MenuItem value="UNITED_KINGDOM">UNITED_KINGDOM</MenuItem>
                            <MenuItem value="USA">USA</MenuItem>
                            <MenuItem value="CHINA">CHINA</MenuItem>
                            <MenuItem value="ITALY">ITALY</MenuItem>
                            <MenuItem value="SOUTH_KOREA">SOUTH_KOREA</MenuItem>
                        </Select>
                    </FormControl>

                    <Typography variant="subtitle2">
                        Локация (опционально)
                    </Typography>

                    <Box display="flex" gap={1}>
                        <TextField
                            label="X (double)"
                            type="number"
                            inputProps={{ step: 'any' }}
                            value={formData.locationX}
                            onChange={e =>
                                setFormData({
                                    ...formData,
                                    locationX: e.target.value
                                })
                            }
                        />

                        <TextField
                            label="Y (int)"
                            type="number"
                            inputProps={{ step: 1 }}
                            value={formData.locationY}
                            onChange={e =>
                                setFormData({
                                    ...formData,
                                    locationY: e.target.value
                                })
                            }
                        />

                        <TextField
                            label="Название"
                            value={formData.locationName}
                            onChange={e =>
                                setFormData({
                                    ...formData,
                                    locationName: e.target.value
                                })
                            }
                        />
                    </Box>
                </DialogContent>

                <DialogActions>
                    <Button onClick={onClose}>Отмена</Button>
                    <Button variant="contained" type="submit">
                        Добавить
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default PersonModal;
