package com.lab.service;

import com.lab.model.Person;
import com.lab.repository.PersonDao;
import com.lab.repository.StudyGroupDao;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class PersonServiceImpl implements PersonService {

    private final PersonDao personDao;
    private final StudyGroupDao studyGroupDao;
    private final SseService sseService;

    @Autowired
    public PersonServiceImpl(
            PersonDao personDao,
            StudyGroupDao studyGroupDao,
            SseService sseService
    ) {
        this.personDao = personDao;
        this.studyGroupDao = studyGroupDao;
        this.sseService = sseService;
    }

    @Override
    @Transactional
    public Person save(Person person) {
        Person saved = personDao.save(person);
        sseService.notifyAfterCommit();
        return saved;
    }

    @Override
    @Transactional(readOnly = true)
    public Person findById(Long id) {
        return personDao.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Администратор не найден"));
    }

    @Override
    @Transactional(readOnly = true)
    public List<Person> findAll() {
        return personDao.findAll();
    }

    @Override
    @Transactional
    public Person update(Person person) {
        Person updated = personDao.update(person);
        sseService.notifyAfterCommit();
        return updated;
    }

    @Override
    @Transactional
    public void delete(Long id) {
        personDao.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Администратор не найден"));

        if (studyGroupDao.countByGroupAdminId(id) > 0) {
            throw new IllegalStateException(
                    "Нельзя удалить администратора: он связан с учебной группой"
            );
        }

        personDao.delete(id);
        sseService.notifyAfterCommit();
    }
}
