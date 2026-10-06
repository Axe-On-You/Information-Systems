package com.lab.service;

import com.lab.model.StudyGroup;
import com.lab.repository.StudyGroupDao;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

@Service
public class StudyGroupServiceImpl implements StudyGroupService {

    private final StudyGroupDao studyGroupDao;

    @Autowired
    public StudyGroupServiceImpl(StudyGroupDao studyGroupDao) {
        this.studyGroupDao = studyGroupDao;
    }

    @Override
    @Transactional
    public StudyGroup save(StudyGroup studyGroup) {
        return studyGroupDao.save(studyGroup);
    }

    @Override
    @Transactional
    public StudyGroup update(StudyGroup updatedGroup) {
        StudyGroup existing = studyGroupDao.findById(updatedGroup.getId())
                .orElseThrow(EntityNotFoundException::new);

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
        existing.setGroupAdmin(updatedGroup.getGroupAdmin());

        return studyGroupDao.update(existing);
    }

    @Override
    @Transactional(readOnly = true)
    public StudyGroup findById(Long id) {
        return studyGroupDao.findById(id).orElseThrow(EntityNotFoundException::new);
    }

    @Override
    @Transactional
    public void delete(Long id) {
        studyGroupDao.delete(id);
    }

    @Override
    @Transactional(readOnly = true)
    public List<StudyGroup> findAll(Map<String, Object> filters, int page, int size, String sortBy, boolean asc) {
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
        return studyGroupDao.findByGroupAdminLessThan(personId);
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
        }
    }

    @Override
    @Transactional
    public void transferStudents(Long sourceGroupId, Long targetGroupId) {
        StudyGroup sourceGroup = findById(sourceGroupId);
        StudyGroup targetGroup = findById(targetGroupId);

        Long sourceStudents = sourceGroup.getStudentsCount();

        if (sourceStudents != null) {
            Long targetStudents = targetGroup.getStudentsCount();

            if (targetStudents == null) {
                targetGroup.setStudentsCount(sourceStudents);
            } else {
                targetGroup.setStudentsCount(targetStudents + sourceStudents);
            }

            sourceGroup.setStudentsCount(null);

            studyGroupDao.update(sourceGroup);
            studyGroupDao.update(targetGroup);
        }
    }
}