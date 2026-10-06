import { useEffect, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { fetchGroups, fetchPersons, showNotification } from '../store/groupSlice';
import api from '../api/axios';

const emptyForm = {
    name: '',
    coordinates: { x: '', y: '' },
    studentsCount: '',
    expelledStudents: '',
    transferredStudents: '',
    formOfEducation: '',
    shouldBeExpelled: '',
    averageMark: '',
    semesterEnum: '',
    adminId: ''
};

const positiveFields = [
    ['expelledStudents', 'Количество отчисленных студентов'],
    ['shouldBeExpelled', 'Количество студентов к отчислению'],
    ['averageMark', 'Средняя оценка']
];

const optionalPositiveFields = [
    ['studentsCount', 'Количество студентов'],
    ['transferredStudents', 'Количество переведённых студентов']
];

const GroupModal = ({ open, onClose, editData }) => {
    const dispatch = useDispatch();
    const persons = useSelector(state => state.groups.persons);
    const [formData, setFormData] = useState(emptyForm);

    useEffect(() => {
        if (open) {
            dispatch(fetchPersons());
            if (editData) {
                setFormData({
                    name: editData.name,
                    coordinates: { x: editData.coordinates.x, y: editData.coordinates.y },
                    studentsCount: editData.studentsCount || '',
                    expelledStudents: editData.expelledStudents,
                    transferredStudents: editData.transferredStudents || '',
                    formOfEducation: editData.formOfEducation || '',
                    shouldBeExpelled: editData.shouldBeExpelled,
                    averageMark: editData.averageMark,
                    semesterEnum: editData.semesterEnum || '',
                    adminId: editData.groupAdmin ? editData.groupAdmin.id : ''
                });
            } else {
                setFormData(emptyForm);
            }
        }
    }, [open, editData, dispatch]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const invalidPositive = [...positiveFields, ...optionalPositiveFields]
            .map(([field, label]) => {
                const value = formData[field];
                return value !== '' && (!Number.isFinite(Number(value)) || Number(value) <= 0) ? label : null;
            })
            .filter(Boolean);

        if (invalidPositive.length > 0) {
            dispatch(showNotification({
                message: 'Поля должны быть больше 0: ' + invalidPositive.join(', '),
                severity: 'error'
            }));
            return;
        }

        if (!formData.name.trim()) {
            dispatch(showNotification({
                message: 'Название группы не может быть пустым',
                severity: 'error'
            }));
            return;
        }

        if (formData.coordinates.x === '' || formData.coordinates.y === '') {
            dispatch(showNotification({
                message: 'Координаты X и Y обязательны',
                severity: 'error'
            }));
            return;
        }

        const payload = {
            name: formData.name,
            coordinates: {
                x: Number(formData.coordinates.x),
                y: Number(formData.coordinates.y)
            },
            studentsCount: formData.studentsCount !== '' ? Number(formData.studentsCount) : null,
            expelledStudents: formData.expelledStudents !== '' ? Number(formData.expelledStudents) : null,
            transferredStudents: formData.transferredStudents !== '' ? Number(formData.transferredStudents) : null,
            formOfEducation: formData.formOfEducation || null,
            shouldBeExpelled: formData.shouldBeExpelled !== '' ? Number(formData.shouldBeExpelled) : null,
            averageMark: formData.averageMark !== '' ? Number(formData.averageMark) : null,
            semesterEnum: formData.semesterEnum || null,
            groupAdmin: formData.adminId
                ? persons.find(person => String(person.id) === String(formData.adminId)) || null
                : null
        };

        try {
            if (editData) {
                await api.put('/study-groups/' + editData.id, payload);
                dispatch(showNotification({ message: 'Группа успешно обновлена', severity: 'success' }));
            } else {
                await api.post('/study-groups', payload);
                dispatch(showNotification({ message: 'Группа успешно создана', severity: 'success' }));
            }
            dispatch(fetchGroups());
            onClose();
        } catch (error) {
            if (error.response?.data) {
                const errorMessages = Object.entries(error.response.data)
                    .map(([field, msg]) => field + ': ' + msg)
                    .join(' | ');
                dispatch(showNotification({
                    message: 'Ошибка: ' + errorMessages,
                    severity: 'error'
                }));
            } else {
                dispatch(showNotification({
                    message: 'Ошибка сервера',
                    severity: 'error'
                }));
            }
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>{editData ? 'Редактировать группу' : 'Создать группу'}</DialogTitle>
            <form onSubmit={handleSubmit}>
                <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
                    <TextField label="Название" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                    <TextField label="Координата X" type="number" required value={formData.coordinates.x} onChange={e => setFormData({...formData, coordinates: { ...formData.coordinates, x: e.target.value }})} />
                    <TextField label="Координата Y" type="number" required value={formData.coordinates.y} onChange={e => setFormData({...formData, coordinates: { ...formData.coordinates, y: e.target.value }})} />
                    <TextField label="Количество студентов" type="number" value={formData.studentsCount} onChange={e => setFormData({...formData, studentsCount: e.target.value})} />
                    <TextField label="Отчисленные студенты (>0)" type="number" required value={formData.expelledStudents} onChange={e => setFormData({...formData, expelledStudents: e.target.value})} />
                    <TextField label="Переведенные студенты" type="number" value={formData.transferredStudents} onChange={e => setFormData({...formData, transferredStudents: e.target.value})} />
                    <FormControl>
                        <InputLabel>Форма обучения</InputLabel>
                        <Select value={formData.formOfEducation} label="Форма обучения" onChange={e => setFormData({...formData, formOfEducation: e.target.value})}>
                            <MenuItem value=""><em>Нет</em></MenuItem>
                            <MenuItem value="DISTANCE_EDUCATION">DISTANCE_EDUCATION</MenuItem>
                            <MenuItem value="FULL_TIME_EDUCATION">FULL_TIME_EDUCATION</MenuItem>
                            <MenuItem value="EVENING_CLASSES">EVENING_CLASSES</MenuItem>
                        </Select>
                    </FormControl>
                    <TextField label="Студенты к отчислению (>0)" type="number" required value={formData.shouldBeExpelled} onChange={e => setFormData({...formData, shouldBeExpelled: e.target.value})} />
                    <TextField label="Средний балл (>0)" type="number" required value={formData.averageMark} onChange={e => setFormData({...formData, averageMark: e.target.value})} />
                    <FormControl>
                        <InputLabel>Семестр</InputLabel>
                        <Select value={formData.semesterEnum} label="Семестр" onChange={e => setFormData({...formData, semesterEnum: e.target.value})}>
                            <MenuItem value=""><em>Нет</em></MenuItem>
                            <MenuItem value="SECOND">SECOND</MenuItem>
                            <MenuItem value="FIFTH">FIFTH</MenuItem>
                            <MenuItem value="EIGHTH">EIGHTH</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl>
                        <InputLabel>Администратор</InputLabel>
                        <Select value={formData.adminId} label="Администратор" onChange={e => setFormData({...formData, adminId: e.target.value})}>
                            <MenuItem value=""><em>Нет</em></MenuItem>
                            {persons.map(person => (
                                <MenuItem key={person.id} value={person.id}>
                                    {person.name} (ID: {person.id})
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose}>Отмена</Button>
                    <Button variant="contained" type="submit">Сохранить</Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default GroupModal;
