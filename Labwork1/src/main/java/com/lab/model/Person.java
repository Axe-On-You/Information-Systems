package com.lab.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

@Entity
@Table(name = "person")
public class Person implements Comparable<Person> {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Person name cannot be null or empty")
    @Column(
            name = "name",
            nullable = false,
            columnDefinition = "VARCHAR(255) CHECK (btrim(name) <> '')"
    )
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(name = "eye_color")
    private Color eyeColor;

    @NotNull(message = "Hair color cannot be null")
    @Enumerated(EnumType.STRING)
    @Column(name = "hair_color", nullable = false)
    private Color hairColor;

    @OneToOne(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "location_id")
    private Location location;

    @NotNull(message = "Birthday cannot be null")
    @Column(name = "birthday", nullable = false)
    private LocalDate birthday;

    @Enumerated(EnumType.STRING)
    @Column(name = "nationality")
    private Country nationality;

    public Person() {}

    @Override
    public int compareTo(Person other) {
        int nameComparison = this.name.compareTo(other.name);
        if (nameComparison != 0) {
            return nameComparison;
        }
        return this.birthday.compareTo(other.birthday);
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public Color getEyeColor() { return eyeColor; }
    public void setEyeColor(Color eyeColor) { this.eyeColor = eyeColor; }

    public Color getHairColor() { return hairColor; }
    public void setHairColor(Color hairColor) { this.hairColor = hairColor; }

    public Location getLocation() { return location; }
    public void setLocation(Location location) { this.location = location; }

    public LocalDate getBirthday() { return birthday; }
    public void setBirthday(LocalDate birthday) { this.birthday = birthday; }

    public Country getNationality() { return nationality; }
}
