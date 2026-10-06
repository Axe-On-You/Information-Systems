import { useEffect, useState } from 'react';
import { Container, CssBaseline, Snackbar, Alert } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { fetchGroups, fetchPersons, hideNotification } from './store/groupSlice';
import Header from './components/Header';
import GroupTable from './components/GroupTable';
import GroupModal from './components/GroupModal';
import PersonModal from './components/PersonModal';
import PersonListModal from './components/PersonListModal';
import SpecialOpsPanel from './components/SpecialOpsPanel';

function App() {
    const dispatch = useDispatch();
    const { notification } = useSelector(state => state.groups);

    const [groupModalOpen, setGroupModalOpen] = useState(false);
    const [personModalOpen, setPersonModalOpen] = useState(false);
    const [personListModalOpen, setPersonListModalOpen] = useState(false);
    const [editingGroup, setEditingGroup] = useState(null);

    useEffect(() => {
        const eventSource = new EventSource('http://localhost:8080/api/stream');

        const handleUpdate = () => {
            dispatch(fetchGroups());
            dispatch(fetchPersons());
        };

        eventSource.addEventListener('update', handleUpdate);

        return () => {
            eventSource.removeEventListener('update', handleUpdate);
            eventSource.close();
        };
    }, [dispatch]);

    const handleOpenGroup = (groupData = null) => {
        setEditingGroup(groupData);
        setGroupModalOpen(true);
    };

    return (
        <>
            <CssBaseline />
            <Header
                onOpenGroup={() => handleOpenGroup(null)}
                onOpenPerson={() => setPersonModalOpen(true)}
                onOpenPersonList={() => setPersonListModalOpen(true)}
            />
            <Container maxWidth="xl">
                <GroupTable onEdit={handleOpenGroup} />
                <SpecialOpsPanel />
            </Container>

            <GroupModal
                open={groupModalOpen}
                onClose={() => setGroupModalOpen(false)}
                editData={editingGroup}
            />

            <PersonModal
                open={personModalOpen}
                onClose={() => setPersonModalOpen(false)}
            />

            <PersonListModal
                open={personListModalOpen}
                onClose={() => setPersonListModalOpen(false)}
            />

            <Snackbar
                open={notification.open}
                autoHideDuration={6000}
                onClose={() => dispatch(hideNotification())}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert
                    onClose={() => dispatch(hideNotification())}
                    severity={notification.severity}
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    {notification.message}
                </Alert>
            </Snackbar>
        </>
    );
}

export default App;
