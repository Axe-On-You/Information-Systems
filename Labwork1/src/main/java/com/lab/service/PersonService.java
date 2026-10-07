package com.lab.service;

import com.lab.model.Person;
import java.util.List;

public interface PersonService {
    Person save(Person person);
    Person findById(Long id);
    List<Person> findAll();
    Person update(Person person);
    void delete(Long id);
}