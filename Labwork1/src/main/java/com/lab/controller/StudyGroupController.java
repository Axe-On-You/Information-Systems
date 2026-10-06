package com.lab.controller;

import com.lab.model.StudyGroup;
import com.lab.service.StudyGroupService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/study-groups")
public class StudyGroupController {

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
        int page = Integer.parseInt(params.getOrDefault("page", "1"));
        int size = Integer.parseInt(params.getOrDefault("size", "10"));
        String sortBy = params.getOrDefault("sortBy", "id");
        boolean asc = Boolean.parseBoolean(params.getOrDefault("asc", "true"));

        Map<String, Object> filters = new HashMap<>(params);
        filters.remove("page");
        filters.remove("size");
        filters.remove("sortBy");
        filters.remove("asc");

        List<StudyGroup> data = studyGroupService.findAll(filters, page, size, sortBy, asc);
        long total = studyGroupService.count(filters);

        Map<String, Object> response = new HashMap<>();
        response.put("data", data);
        response.put("total", total);
        return response;
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
    public void transfer(@RequestParam("sourceId") Long sourceId, @RequestParam("targetId") Long targetId) {
        studyGroupService.transferStudents(sourceId, targetId);
    }
}