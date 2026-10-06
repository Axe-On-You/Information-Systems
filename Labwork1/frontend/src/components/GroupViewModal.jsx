import { useEffect, useState } from 'react';
import {
    Box,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    Button,
    Typography
} from '@mui/material';
import api from '../api/axios';

const valueOrDash = value =>
    value === null || value === undefined || value === '' ? '—' : value;

const GroupViewModal = ({ open, groupId, onClose }) => {
    const [group, setGroup] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!open || groupId === null) {
            return;
        }

        setLoading(true);
        setError('');
        setGroup(null);

        api.get('/study-groups/' + groupId)
            .then(response => {
                setGroup(response.data);
            })
            .catch(requestError => {
                setError(
                    requestError.response?.data?.error ||
                    requestError.message ||
                    'Не удалось получить данные группы'
                );
            })
            .finally(() => {
                setLoading(false);
            });
    }, [open, groupId]);

    const admin = group?.groupAdmin;
    const location = admin?.location;

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>
                Информация о группе {groupId !== null ? '#' + groupId : ''}
            </DialogTitle>

            <DialogContent dividers>
                {loading && (
                    <Box display="flex" justifyContent="center" py={4}>
                        <CircularProgress />
                    </Box>
                )}

                {!loading && error && (
                    <Typography color="error">
                        {error}
                    </Typography>
                )}

                {!loading && !error && group && (
                    <Box display="flex" flexDirection="column" gap={2}>
                        <Typography variant="h6">
                            StudyGroup
                        </Typography>

                        <Typography>
                            <strong>ID:</strong> {valueOrDash(group.id)}
                        </Typography>
                        <Typography>
                            <strong>Название:</strong> {valueOrDash(group.name)}
                        </Typography>
                        <Typography>
                            <strong>Координаты:</strong>{' '}
                            X={valueOrDash(group.coordinates?.x)},{' '}
                            Y={valueOrDash(group.coordinates?.y)}
                        </Typography>
                        <Typography>
                            <strong>Дата создания:</strong>{' '}
                            {valueOrDash(group.creationDate)}
                        </Typography>
                        <Typography>
                            <strong>Количество студентов:</strong>{' '}
                            {valueOrDash(group.studentsCount)}
                        </Typography>
                        <Typography>
                            <strong>Отчисленные студенты:</strong>{' '}
                            {valueOrDash(group.expelledStudents)}
                        </Typography>
                        <Typography>
                            <strong>Переведённые студенты:</strong>{' '}
                            {valueOrDash(group.transferredStudents)}
                        </Typography>
                        <Typography>
                            <strong>Форма обучения:</strong>{' '}
                            {valueOrDash(group.formOfEducation)}
                        </Typography>
                        <Typography>
                            <strong>К отчислению:</strong>{' '}
                            {valueOrDash(group.shouldBeExpelled)}
                        </Typography>
                        <Typography>
                            <strong>Средняя оценка:</strong>{' '}
                            {valueOrDash(group.averageMark)}
                        </Typography>
                        <Typography>
                            <strong>Семестр:</strong>{' '}
                            {valueOrDash(group.semesterEnum)}
                        </Typography>

                        <Divider />

                        <Typography variant="h6">
                            Связанный groupAdmin
                        </Typography>

                        {admin ? (
                            <Box display="flex" flexDirection="column" gap={1}>
                                <Typography>
                                    <strong>ID:</strong> {valueOrDash(admin.id)}
                                </Typography>
                                <Typography>
                                    <strong>Имя:</strong> {valueOrDash(admin.name)}
                                </Typography>
                                <Typography>
                                    <strong>Цвет глаз:</strong>{' '}
                                    {valueOrDash(admin.eyeColor)}
                                </Typography>
                                <Typography>
                                    <strong>Цвет волос:</strong>{' '}
                                    {valueOrDash(admin.hairColor)}
                                </Typography>
                                <Typography>
                                    <strong>Дата рождения:</strong>{' '}
                                    {valueOrDash(admin.birthday)}
                                </Typography>
                                <Typography>
                                    <strong>Национальность:</strong>{' '}
                                    {valueOrDash(admin.nationality)}
                                </Typography>

                                <Typography variant="subtitle1">
                                    Связанная Location
                                </Typography>

                                {location ? (
                                    <Box pl={2}>
                                        <Typography>
                                            <strong>X:</strong>{' '}
                                            {valueOrDash(location.x)}
                                        </Typography>
                                        <Typography>
                                            <strong>Y:</strong>{' '}
                                            {valueOrDash(location.y)}
                                        </Typography>
                                        <Typography>
                                            <strong>Название:</strong>{' '}
                                            {valueOrDash(location.name)}
                                        </Typography>
                                    </Box>
                                ) : (
                                    <Typography>
                                        Локация не указана.
                                    </Typography>
                                )}
                            </Box>
                        ) : (
                            <Typography>
                                Администратор не указан.
                            </Typography>
                        )}
                    </Box>
                )}
            </DialogContent>

            <DialogActions>
                <Button onClick={onClose}>Закрыть</Button>
            </DialogActions>
        </Dialog>
    );
};

export default GroupViewModal;
