import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Table, TableBody, TableCell, TableContainer, TableHead,
    TableRow, Paper, TablePagination, TableSortLabel, TextField, Button, Box
} from '@mui/material';
import {
    fetchGroups,
    setPagination,
    setSorting,
    setFilter,
    clearAllFilters,
    showNotification
} from '../store/groupSlice';
import api from '../api/axios';

const columns = [
    { id: 'id', label: 'ID', sortable: false, filterable: false },
    { id: 'name', label: 'Название', sortable: true, filterable: true },
    { id: 'coordinates.x', label: 'Коорд X', sortable: false, filterable: false },
    { id: 'coordinates.y', label: 'Коорд Y', sortable: false, filterable: false },
    { id: 'creationDate', label: 'Дата создания', sortable: false, filterable: false },
    { id: 'studentsCount', label: 'Студенты', sortable: false, filterable: false },
    { id: 'expelledStudents', label: 'Отчислены', sortable: false, filterable: false },
    { id: 'transferredStudents', label: 'Переведены', sortable: false, filterable: false },
    { id: 'formOfEducation', label: 'Обучение', sortable: true, filterable: true },
    { id: 'shouldBeExpelled', label: 'К отчислению', sortable: false, filterable: false },
    { id: 'averageMark', label: 'Ср. балл', sortable: false, filterable: false },
    { id: 'semesterEnum', label: 'Семестр', sortable: true, filterable: true },
    { id: 'groupAdmin.name', label: 'Имя админа', sortable: true, filterable: true }
];

const GroupTable = ({ onEdit, onView }) => {
    const dispatch = useDispatch();
    const { data, total, page, size, sortBy, asc, filters } = useSelector(state => state.groups);
    const [localFilters, setLocalFilters] = useState({});

    useEffect(() => {
        dispatch(fetchGroups());
    }, [dispatch, page, size, sortBy, asc, filters]);

    useEffect(() => {
        const maxPage = Math.max(1, Math.ceil(total / size));

        if (page > maxPage) {
            dispatch(setPagination({ page: maxPage, size }));
        }
    }, [dispatch, page, size, total]);

    const handleSort = (property) => {
        dispatch(setSorting(property));
    };

    const handleFilterChange = (field, value) => {
        setLocalFilters(prev => ({ ...prev, [field]: value }));
    };

    const applyFilters = () => {
        dispatch(setFilter(localFilters));
    };

    const clearFilters = () => {
        setLocalFilters({});
        dispatch(clearAllFilters());
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Удалить эту группу?')) {
            return;
        }

        try {
            await api.delete('/study-groups/' + id);
            dispatch(fetchGroups());
            dispatch(showNotification({
                message: 'Группа успешно удалена',
                severity: 'success'
            }));
        } catch (error) {
            dispatch(showNotification({
                message: 'Ошибка удаления: ' +
                    (error.response?.data?.error || error.message),
                severity: 'error'
            }));
        }
    };

    return (
        <Paper sx={{ width: '100%', mb: 2, overflow: 'hidden' }}>
            <Box p={2} display="flex" justifyContent="flex-end" gap={2}>
                <Button variant="outlined" color="secondary" onClick={clearFilters}>
                    Очистить всё
                </Button>
                <Button variant="contained" color="primary" onClick={applyFilters}>
                    Найти по фильтрам
                </Button>
            </Box>

            <TableContainer sx={{ maxHeight: 600 }}>
                <Table stickyHeader size="small">
                    <TableHead>
                        <TableRow>
                            {columns.map(col => (
                                <TableCell key={col.id}>
                                    {col.sortable ? (
                                        <TableSortLabel
                                            active={sortBy === col.id}
                                            direction={sortBy === col.id && !asc ? 'desc' : 'asc'}
                                            onClick={() => handleSort(col.id)}
                                        >
                                            {col.label}
                                        </TableSortLabel>
                                    ) : (
                                        col.label
                                    )}

                                    {col.filterable && (
                                        <TextField
                                            size="small"
                                            variant="standard"
                                            placeholder="Полное совпадение..."
                                            value={localFilters[col.id] || ''}
                                            onChange={e => handleFilterChange(col.id, e.target.value)}
                                        />
                                    )}
                                </TableCell>
                            ))}
                            <TableCell>Действия</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {data.map(row => (
                            <TableRow key={row.id}>
                                <TableCell>{row.id}</TableCell>
                                <TableCell>{row.name}</TableCell>
                                <TableCell>{row.coordinates.x}</TableCell>
                                <TableCell>{row.coordinates.y}</TableCell>
                                <TableCell>
                                    {row.creationDate
                                        ? new Date(row.creationDate).toLocaleString('ru-RU', {
                                            dateStyle: 'short',
                                            timeStyle: 'short',
                                        })
                                        : '-'}
                                </TableCell>
                                <TableCell>{row.studentsCount ?? '-'}</TableCell>
                                <TableCell>{row.expelledStudents}</TableCell>
                                <TableCell>{row.transferredStudents ?? '-'}</TableCell>
                                <TableCell>{row.formOfEducation || '-'}</TableCell>
                                <TableCell>{row.shouldBeExpelled}</TableCell>
                                <TableCell>{row.averageMark}</TableCell>
                                <TableCell>{row.semesterEnum || '-'}</TableCell>
                                <TableCell>
                                    {row.groupAdmin
                                        ? row.groupAdmin.name + ' (ID: ' + row.groupAdmin.id + ')'
                                        : '-'}
                                </TableCell>

                                <TableCell sx={{ display: 'flex', gap: 1 }}>
                                    <Button
                                        size="small"
                                        variant="outlined"
                                        onClick={() => onView(row.id)}
                                    >
                                        Подробнее
                                    </Button>
                                    <Button
                                        size="small"
                                        variant="contained"
                                        onClick={() => onEdit(row)}
                                    >
                                        Изменить
                                    </Button>
                                    <Button
                                        size="small"
                                        color="error"
                                        variant="contained"
                                        onClick={() => handleDelete(row.id)}
                                    >
                                        Удалить
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <TablePagination
                component="div"
                count={total}
                page={page - 1}
                onPageChange={(_, newPage) =>
                    dispatch(setPagination({ page: newPage + 1, size }))
                }
                rowsPerPage={size}
                onRowsPerPageChange={e =>
                    dispatch(setPagination({
                        page: 1,
                        size: parseInt(e.target.value, 10)
                    }))
                }
                labelRowsPerPage="Строк:"
            />
        </Paper>
    );
};

export default GroupTable;
