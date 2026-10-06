package com.lab.controller;

import com.lab.model.StudyGroup;
import com.lab.service.StudyGroupService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

@RestController
@RequestMapping("/api/study-groups")
public class StudyGroupController {

    private static final Set<String> ALLOWED_FILTER_FIELDS = Set.of(
            "name",
            "formOfEducation",
            "semesterEnum",
            "groupAdmin.name"
    );

    private static final Set<String> ALLOWED_SORT_FIELDS = Set.of(
            "id",
            "name",
            "formOfEducation",
            "semesterEnum",
            "groupAdmin.name"
    );

    private final StudyGroupService studyGroupService;

    @Autowired
    public StudyGroupController(StudyGroupService studyGroupService) {
        this.studyGroupService = studyGroupService;
    }

    @PostMapping
    public StudyGroup create(@Valid @RequestBody StudyGroup studyGroup) {
        return studyGroupService.save(studyGroup);
    }

    @GetMapping("/{id}")
    public StudyGroup getById(@PathVariable("id") Long id) {
        return studyGroupService.findById(id);
    }

    @PutMapping("/{id}")
    public StudyGroup update(@PathVariable("id") Long id, @Valid @RequestBody StudyGroup studyGroup) {
        studyGroup.setId(id);
        return studyGroupService.update(studyGroup);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable("id") Long id) {
        studyGroupService.delete(id);
    }

    @GetMapping
    public Map<String, Object> getAll(@RequestParam Map<String, String> params) {
        int page = parsePositiveInt(params.getOrDefault("page", "1"), "page");
        int size = parsePositiveInt(params.getOrDefault("size", "10"), "size");

        if (size > 100) {
            throw new IllegalArgumentException("Размер страницы не может быть больше 100");
        }

        String sortBy = params.getOrDefault("sortBy", "id");
        if (!ALLOWED_SORT_FIELDS.contains(sortBy)) {
            throw new IllegalArgumentException("Недопустимое поле сортировки: " + sortBy);
        }

        String ascParam = params.getOrDefault("asc", "true");
        if (!"true".equalsIgnoreCase(ascParam) && !"false".equalsIgnoreCase(ascParam)) {
            throw new IllegalArgumentException("Параметр asc должен быть true или false");
        }
        boolean asc = Boolean.parseBoolean(ascParam);

        Map<String, Object> filters = new HashMap<>();

        for (Map.Entry<String, String> entry : params.entrySet()) {
            String key = entry.getKey();

            if (key.equals("page") || key.equals("size") || key.equals("sortBy") || key.equals("asc")) {
                continue;
            }

            if (!ALLOWED_FILTER_FIELDS.contains(key)) {
                throw new IllegalArgumentException("Недопустимое поле фильтра: " + key);
            }

            if (entry.getValue() != null && !entry.getValue().trim().isEmpty()) {
                filters.put(key, entry.getValue());
            }
        }

        List<StudyGroup> data = studyGroupService.findAll(filters, page, size, sortBy, asc);
        long total = studyGroupService.count(filters);

        Map<String, Object> response = new HashMap<>();
        response.put("data", data);
        response.put("total", total);
        return response;
    }

    private int parsePositiveInt(String value, String parameterName) {
        try {
            int parsed = Integer.parseInt(value);

            if (parsed < 1) {
                throw new IllegalArgumentException(
                        "Параметр " + parameterName + " должен быть больше 0"
                );
            }

            return parsed;
        } catch (NumberFormatException ex) {
            throw new IllegalArgumentException(
                    "Параметр " + parameterName + " должен быть целым числом"
            );
        }
    }

    @GetMapping("/special/count-by-admin/{adminId}")
    public Map<String, Long> countByAdmin(@PathVariable("adminId") Long adminId) {
        long count = studyGroupService.countByGroupAdmin(adminId);
        Map<String, Long> response = new HashMap<>();
        response.put("count", count);
        return response;
    }

    @GetMapping("/special/count-should-be-expelled-greater")
    public Map<String, Long> countShouldBeExpelledGreater(@RequestParam("value") int value) {
        long count = studyGroupService.countByShouldBeExpelledGreaterThan(value);
        Map<String, Long> response = new HashMap<>();
        response.put("count", count);
        return response;
    }

    @GetMapping("/special/admin-less-than/{adminId}")
    public List<StudyGroup> getAdminLessThan(@PathVariable("adminId") Long adminId) {
        return studyGroupService.findByGroupAdminLessThan(adminId);
    }

    @PostMapping("/{id}/expel-all")
    public void expelAll(@PathVariable("id") Long id) {
        studyGroupService.expelAllStudents(id);
    }

    @PostMapping("/transfer")
    public void transfer(
            @RequestParam("sourceId") Long sourceId,
            @RequestParam("targetId") Long targetId
    ) {
        studyGroupService.transferStudents(sourceId, targetId);
    }
}
