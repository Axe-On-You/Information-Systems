package com.lab.repository;

import com.lab.model.Person;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public class PersonDaoImpl implements PersonDao {

    @PersistenceContext
    private EntityManager em;

    @Override
    public Person save(Person person) {
        em.persist(person);
        return person;
    }

    @Override
    public Optional<Person> findById(Long id) {
        return Optional.ofNullable(em.find(Person.class, id));
    }

    @Override
    public List<Person> findAll() {
        return em.createQuery("SELECT p FROM Person p", Person.class).getResultList();
    }

    @Override
    public Person update(Person person) {
        return em.merge(person);
    }

    @Override
    public void delete(Long id) {
        Person person = em.find(Person.class, id);
        if (person != null) {
            em.remove(person);
        }
    }
}