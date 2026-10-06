package com.lab.service;

import com.lab.model.Person;
import com.lab.model.StudyGroup;
import com.lab.repository.PersonDao;
import com.lab.repository.StudyGroupDao;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class StudyGroupServiceImpl implements StudyGroupService {

    private final StudyGroupDao studyGroupDao;
    private final PersonDao personDao;
    private final SseService sseService;

    @Autowired
    public StudyGroupServiceImpl(
            StudyGroupDao studyGroupDao,
            PersonDao personDao,
            SseService sseService
    ) {
        this.studyGroupDao = studyGroupDao;
        this.personDao = personDao;
        this.sseService = sseService;
    }

    @Override
    @Transactional
    public StudyGroup save(StudyGroup studyGroup) {
        if (studyGroup.getGroupAdmin() != null && studyGroup.getGroupAdmin().getId() != null) {
            Person admin = personDao.findById(studyGroup.getGroupAdmin().getId())
                    .orElseThrow(() -> new EntityNotFoundException("Администратор не найден"));
            studyGroup.setGroupAdmin(admin);
        }

        StudyGroup saved = studyGroupDao.save(studyGroup);
        sseService.notifyAfterCommit();
        return saved;
    }

    @Override
    @Transactional
    public StudyGroup update(StudyGroup updatedGroup) {
        StudyGroup existing = studyGroupDao.findById(updatedGroup.getId())
                .orElseThrow(() -> new EntityNotFoundException("Группа не найдена"));

        existing.setName(updatedGroup.getName());
        existing.getCoordinates().setX(updatedGroup.getCoordinates().getX());
        existing.getCoordinates().setY(updatedGroup.getCoordinates().getY());
        existing.setStudentsCount(updatedGroup.getStudentsCount());
        existing.setExpelledStudents(updatedGroup.getExpelledStudents());
        existing.setTransferredStudents(updatedGroup.getTransferredStudents());
        existing.setFormOfEducation(updatedGroup.getFormOfEducation());
        existing.setShouldBeExpelled(updatedGroup.getShouldBeExpelled());
        existing.setAverageMark(updatedGroup.getAverageMark());
        existing.setSemesterEnum(updatedGroup.getSemesterEnum());

        if (updatedGroup.getGroupAdmin() != null && updatedGroup.getGroupAdmin().getId() != null) {
            Person admin = personDao.findById(updatedGroup.getGroupAdmin().getId())
                    .orElseThrow(() -> new EntityNotFoundException("Администратор не найден"));
            existing.setGroupAdmin(admin);
        } else {
            existing.setGroupAdmin(null);
        }

        StudyGroup saved = studyGroupDao.update(existing);
        sseService.notifyAfterCommit();
        return saved;
    }

    @Override
    @Transactional(readOnly = true)
    public StudyGroup findById(Long id) {
        return studyGroupDao.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Группа не найдена"));
    }

    @Override
    @Transactional
    public void delete(Long id) {
        findById(id);
        studyGroupDao.delete(id);
        sseService.notifyAfterCommit();
    }

    @Override
    @Transactional(readOnly = true)
    public List<StudyGroup> findAll(
            Map<String, Object> filters,
            int page,
            int size,
            String sortBy,
            boolean asc
    ) {
        return studyGroupDao.findAll(filters, page, size, sortBy, asc);
    }

    @Override
    @Transactional(readOnly = true)
    public long count(Map<String, Object> filters) {
        return studyGroupDao.count(filters);
    }

    @Override
    @Transactional(readOnly = true)
    public long countByGroupAdmin(Long personId) {
        return studyGroupDao.countByGroupAdminId(personId);
    }

    @Override
    @Transactional(readOnly = true)
    public long countByShouldBeExpelledGreaterThan(int value) {
        return studyGroupDao.countByShouldBeExpelledGreaterThan(value);
    }

    @Override
    @Transactional(readOnly = true)
    public List<StudyGroup> findByGroupAdminLessThan(Long personId) {
        Person admin = personDao.findById(personId)
                .orElseThrow(() -> new EntityNotFoundException("Администратор не найден"));

        List<StudyGroup> groups = studyGroupDao.findAll();
        List<StudyGroup> result = new ArrayList<>();

        for (StudyGroup group : groups) {
            if (group.getGroupAdmin() != null && group.getGroupAdmin().compareTo(admin) < 0) {
                result.add(group);
            }
        }

        return result;
    }

    @Override
    @Transactional
    public void expelAllStudents(Long groupId) {
        StudyGroup group = findById(groupId);
        Long currentStudents = group.getStudentsCount();

        if (currentStudents != null) {
            group.setExpelledStudents(group.getExpelledStudents() + currentStudents);
            group.setStudentsCount(null);
            studyGroupDao.update(group);
            sseService.notifyAfterCommit();
        }
    }

    @Override
    @Transactional
    public void transferStudents(Long sourceGroupId, Long targetGroupId) {
        if (sourceGroupId.equals(targetGroupId)) {
            throw new IllegalArgumentException(
                    "Нельзя перевести студентов в ту же самую группу"
            );
        }

        StudyGroup sourceGroup = findById(sourceGroupId);
        StudyGroup targetGroup = findById(targetGroupId);
        Long sourceStudents = sourceGroup.getStudentsCount();

        if (sourceStudents != null) {
            Long targetStudents = targetGroup.getStudentsCount();
            targetGroup.setStudentsCount(
                    targetStudents == null ? sourceStudents : targetStudents + sourceStudents
            );
            sourceGroup.setStudentsCount(null);

            studyGroupDao.update(sourceGroup);
            studyGroupDao.update(targetGroup);
            sseService.notifyAfterCommit();
        }
    }
}
