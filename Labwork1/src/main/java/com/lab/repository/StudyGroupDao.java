package com.lab.repository;

import com.lab.model.StudyGroup;

import java.util.List;
import java.util.Map;
import java.util.Optional;

public interface StudyGroupDao {

    StudyGroup save(StudyGroup studyGroup);

    Optional<StudyGroup> findById(Long id);

    StudyGroup update(StudyGroup studyGroup);

    void delete(Long id);

    List<StudyGroup> findAll(Map<String, Object> filters, int page, int size, String sortBy, boolean asc);

    List<StudyGroup> findAll();

    long count(Map<String, Object> filters);

    long countByGroupAdminId(Long personId);

    long countByShouldBeExpelledGreaterThan(int value);
}
