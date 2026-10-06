package com.lab.service;

import com.lab.model.Person;
import com.lab.repository.PersonDao;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class PersonServiceImpl implements PersonService {

    private final PersonDao personDao;

    @Autowired
    public PersonServiceImpl(PersonDao personDao) {
        this.personDao = personDao;
    }

    @Override
    @Transactional
    public Person save(Person person) {
        return personDao.save(person);
    }

    @Override
    @Transactional(readOnly = true)
    public Person findById(Long id) {
        return personDao.findById(id)
                .orElseThrow(EntityNotFoundException::new);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Person> findAll() {
        return personDao.findAll();
    }

    @Override
    @Transactional
    public Person update(Person person) {
        return personDao.update(person);
    }

    @Override
    @Transactional
    public void delete(Long id) {
        personDao.delete(id);
    }
}