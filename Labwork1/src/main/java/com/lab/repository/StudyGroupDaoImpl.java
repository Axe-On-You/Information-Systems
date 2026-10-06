package com.lab.repository;

import com.lab.model.StudyGroup;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.TypedQuery;
import jakarta.persistence.criteria.*;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Repository
public class StudyGroupDaoImpl implements StudyGroupDao {

    @PersistenceContext
    private EntityManager em;

    @Override
    public StudyGroup save(StudyGroup studyGroup) {
        em.persist(studyGroup);
        return studyGroup;
    }

    @Override
    public Optional<StudyGroup> findById(Long id) {
        return Optional.ofNullable(em.find(StudyGroup.class, id));
    }

    @Override
    public StudyGroup update(StudyGroup studyGroup) {
        return em.merge(studyGroup);
    }

    @Override
    public void delete(Long id) {
        StudyGroup group = em.find(StudyGroup.class, id);
        if (group != null) {
            em.remove(group);
        }
    }

    @Override
    public List<StudyGroup> findAll(
            Map<String, Object> filters,
            int page,
            int size,
            String sortBy,
            boolean asc
    ) {
        if (size > 100) {
            size = 100;
        }
        if (page < 1) {
            page = 1;
        }

        CriteriaBuilder cb = em.getCriteriaBuilder();
        CriteriaQuery<StudyGroup> query = cb.createQuery(StudyGroup.class);
        Root<StudyGroup> root = query.from(StudyGroup.class);

        Predicate[] predicates = buildPredicates(filters, cb, root);
        if (predicates.length > 0) {
            query.where(cb.and(predicates));
        }

        if (sortBy != null && !sortBy.trim().isEmpty()) {
            Path<?> sortPath = getPath(root, sortBy);
            if (asc) {
                query.orderBy(cb.asc(sortPath));
            } else {
                query.orderBy(cb.desc(sortPath));
            }
        } else {
            query.orderBy(cb.asc(root.get("id")));
        }

        TypedQuery<StudyGroup> typedQuery = em.createQuery(query);
        typedQuery.setFirstResult((page - 1) * size);
        typedQuery.setMaxResults(size);

        return typedQuery.getResultList();
    }

    @Override
    public List<StudyGroup> findAll() {
        return em.createQuery(
                "SELECT s FROM StudyGroup s ORDER BY s.id",
                StudyGroup.class
        ).getResultList();
    }

    @Override
    public long count(Map<String, Object> filters) {
        CriteriaBuilder cb = em.getCriteriaBuilder();
        CriteriaQuery<Long> query = cb.createQuery(Long.class);
        Root<StudyGroup> root = query.from(StudyGroup.class);

        query.select(cb.count(root));

        Predicate[] predicates = buildPredicates(filters, cb, root);
        if (predicates.length > 0) {
            query.where(cb.and(predicates));
        }

        return em.createQuery(query).getSingleResult();
    }

    private Predicate[] buildPredicates(
            Map<String, Object> filters,
            CriteriaBuilder cb,
            Root<StudyGroup> root
    ) {
        List<Predicate> predicates = new ArrayList<>();

        if (filters != null && !filters.isEmpty()) {
            for (Map.Entry<String, Object> entry : filters.entrySet()) {
                String key = entry.getKey();
                String valueStr = entry.getValue() != null
                        ? entry.getValue().toString()
                        : "";

                if (!valueStr.trim().isEmpty()) {
                    try {
                        Path<?> path = getPath(root, key);
                        Class<?> type = path.getJavaType();

                        if (type == String.class) {
                            predicates.add(cb.equal(path.as(String.class), valueStr));
                        } else if (Enum.class.isAssignableFrom(type)) {
                            @SuppressWarnings({"unchecked", "rawtypes"})
                            Enum<?> enumValue = Enum.valueOf((Class<Enum>) type, valueStr);
                            predicates.add(cb.equal(path, enumValue));
                        }
                    } catch (Exception e) {
                        throw new IllegalArgumentException(
                                "Неверный формат фильтра для поля " + key
                        );
                    }
                }
            }
        }

        return predicates.toArray(new Predicate[0]);
    }

    private Path<?> getPath(Root<StudyGroup> root, String attributePath) {
        if (attributePath.contains(".")) {
            String[] parts = attributePath.split("\\.");
            Join<?, ?> join = root.join(parts[0], JoinType.LEFT);

            for (int i = 1; i < parts.length - 1; i++) {
                join = join.join(parts[i], JoinType.LEFT);
            }

            return join.get(parts[parts.length - 1]);
        }

        return root.get(attributePath);
    }
}
