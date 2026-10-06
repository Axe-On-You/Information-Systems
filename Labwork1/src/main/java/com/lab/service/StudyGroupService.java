package com.lab.service;

import com.lab.model.StudyGroup;

import java.util.List;
import java.util.Map;

public interface StudyGroupService {
    StudyGroup save(StudyGroup studyGroup);
    StudyGroup findById(Long id);
    StudyGroup update(StudyGroup studyGroup);
    void delete(Long id);

    List<StudyGroup> findAll(Map<String, Object> filters, int page, int size, String sortBy, boolean asc);
    long count(Map<String, Object> filters);

    long countByGroupAdmin(Long personId);
    long countByShouldBeExpelledGreaterThan(int value);
    List<StudyGroup> findByGroupAdminLessThan(Long personId);

    void expelAllStudents(Long groupId);
    void transferStudents(Long sourceGroupId, Long targetGroupId);
}