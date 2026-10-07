package com.lab.repository;

import com.lab.model.Person;
import java.util.List;
import java.util.Optional;

public interface PersonDao {
    Person save(Person person);
    Optional<Person> findById(Long id);
    List<Person> findAll();
    Person update(Person person);
    void delete(Long id);
}