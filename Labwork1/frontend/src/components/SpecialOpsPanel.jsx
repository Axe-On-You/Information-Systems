import { useState } from 'react';
import { Paper, Typography, TextField, Button, Box, Divider, Stack } from '@mui/material';
import { useDispatch } from 'react-redux';
import { fetchGroups, showNotification } from '../store/groupSlice';
import api from '../api/axios';

const SpecialOpsPanel = () => {
    const dispatch = useDispatch();
    const [adminIdCount, setAdminIdCount] = useState('');
    const [expelledVal, setExpelledVal] = useState('');
    const [adminIdLess, setAdminIdLess] = useState('');
    const [expelGroupId, setExpelGroupId] = useState('');
    const [transferSource, setTransferSource] = useState('');
    const [transferTarget, setTransferTarget] = useState('');

    const [resCountAdmin, setResCountAdmin] = useState(null);
    const [resExpelledGreater, setResExpelledGreater] = useState(null);
    const [lessThanData, setLessThanData] = useState([]);

    const handleCountAdmin = async () => {
        if (!adminIdCount) return;
        try {
            const res = await api.get(`/study-groups/special/count-by-admin/${adminIdCount}`);
            setResCountAdmin(res.data.count);
            dispatch(showNotification({ message: 'Подсчет завершен', severity: 'success' }));
        } catch (e) { dispatch(showNotification({ message: 'Ошибка подсчета', severity: 'error' })); }
    };

    const handleCountExpelled = async () => {
        if (!expelledVal) return;
        try {
            const res = await api.get(`/study-groups/special/count-should-be-expelled-greater?value=${expelledVal}`);
            setResExpelledGreater(res.data.count);
            dispatch(showNotification({ message: 'Подсчет завершен', severity: 'success' }));
        } catch (e) { dispatch(showNotification({ message: 'Ошибка подсчета', severity: 'error' })); }
    };

    const handleGetAdminLess = async () => {
        if (!adminIdLess) return;
        try {
            const res = await api.get(`/study-groups/special/admin-less-than/${adminIdLess}`);
            setLessThanData(res.data);
            if(res.data.length === 0) dispatch(showNotification({ message: 'Групп не найдено', severity: 'warning' }));
            else dispatch(showNotification({ message: `Найдено групп: ${res.data.length}`, severity: 'success' }));
        } catch (e) { dispatch(showNotification({ message: 'Ошибка поиска', severity: 'error' })); }
    };

    const handleExpelAll = async () => {
        if (!expelGroupId) return;
        try {
            await api.post(`/study-groups/${expelGroupId}/expel-all`);
            dispatch(fetchGroups());
            dispatch(showNotification({ message: 'Студенты отчислены', severity: 'success' }));
        } catch (e) { dispatch(showNotification({ message: 'Ошибка отчисления', severity: 'error' })); }
    };

    const handleTransfer = async () => {
        if (!transferSource || !transferTarget) return;
        try {
            await api.post(`/study-groups/transfer?sourceId=${transferSource}&targetId=${transferTarget}`);
            dispatch(fetchGroups());
            dispatch(showNotification({ message: 'Студенты переведены', severity: 'success' }));
        } catch (e) { dispatch(showNotification({ message: 'Ошибка перевода', severity: 'error' })); }
    };

    return (
        <Paper sx={{ p: 3, mb: 4 }}>
            <Typography variant="h5" gutterBottom>Специальные операции</Typography>
            <Divider sx={{ mb: 3 }} />

            <Stack spacing={4}>
                <Box display="flex" gap={2} flexWrap="wrap" alignItems="center">
                    <TextField size="small" label="ID администратора" value={adminIdCount} onChange={e => setAdminIdCount(e.target.value)} />
                    <Button variant="contained" onClick={handleCountAdmin} sx={{ whiteSpace: 'nowrap' }}>Подсчет групп по админу</Button>
                    {resCountAdmin !== null && <Typography fontWeight="bold" color="primary">Результат: {resCountAdmin}</Typography>}
                </Box>

                <Box display="flex" gap={2} flexWrap="wrap" alignItems="center">
                    <TextField size="small" label="К отчислению > X" value={expelledVal} onChange={e => setExpelledVal(e.target.value)} />
                    <Button variant="contained" onClick={handleCountExpelled}>Подсчитать</Button>
                    {resExpelledGreater !== null && <Typography fontWeight="bold" color="primary">Результат: {resExpelledGreater}</Typography>}
                </Box>

                <Box display="flex" gap={2} flexWrap="wrap" alignItems="center">
                    <TextField size="small" label="Сравнить с админом (ID)" value={adminIdLess} onChange={e => setAdminIdLess(e.target.value)} />
                    <Button variant="contained" onClick={handleGetAdminLess}>Найти группы (Admin {'<'} X)</Button>
                </Box>
                {lessThanData.length > 0 && (
                    <Box p={2} border="1px dashed #ccc" borderRadius={1} bgcolor="#f9f9f9">
                        <Typography variant="subtitle2">Найденные ID групп: {lessThanData.map(g => g.id).join(', ')}</Typography>
                    </Box>
                )}

                <Box display="flex" gap={2} flexWrap="wrap" alignItems="center">
                    <TextField size="small" label="ID группы" value={expelGroupId} onChange={e => setExpelGroupId(e.target.value)} />
                    <Button color="error" variant="contained" onClick={handleExpelAll}>Отчислить всех</Button>
                </Box>

                <Box display="flex" gap={2} flexWrap="wrap" alignItems="center">
                    <TextField size="small" label="Исходная группа (ID)" value={transferSource} onChange={e => setTransferSource(e.target.value)} />
                    <TextField size="small" label="Целевая группа (ID)" value={transferTarget} onChange={e => setTransferTarget(e.target.value)} />
                    <Button color="warning" variant="contained" onClick={handleTransfer}>Перевести студентов</Button>
                </Box>
            </Stack>
        </Paper>
    );
};

export default SpecialOpsPanel;