package com.lab.controller;

import com.lab.model.Person;
import com.lab.service.PersonService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/persons")
public class PersonController {

    private final PersonService personService;

    @Autowired
    public PersonController(PersonService personService) {
        this.personService = personService;
    }

    @GetMapping
    public List<Person> getAll() {
        return personService.findAll();
    }

    @GetMapping("/{id}")
    public Person getById(@PathVariable("id") Long id) {
        return personService.findById(id);
    }

    @PostMapping
    public Person create(@Valid @RequestBody Person person) {
        return personService.save(person);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable("id") Long id) {
        personService.delete(id);
    }
}