package com.lab.model;

import jakarta.persistence.*;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.time.LocalDateTime;

@Entity
@Table(name = "study_group")
public class StudyGroup {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false, unique = true)
    private Long id;

    @Version
    @Column(name = "version")
    private Integer version;

    @NotBlank(message = "Name cannot be null or empty")
    @Column(
            name = "name",
            nullable = false,
            columnDefinition = "VARCHAR(255) CHECK (btrim(name) <> '')"
    )
    private String name;

    @Valid
    @NotNull(message = "Coordinates cannot be null")
    @OneToOne(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "coordinates_id", nullable = false)
    private Coordinates coordinates;

    @Column(
            name = "creation_date",
            nullable = false,
            updatable = false,
            columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP"
    )
    private LocalDateTime creationDate;

    @Positive(message = "Students count must be greater than 0")
    @Column(
            name = "students_count",
            columnDefinition = "BIGINT CHECK (students_count > 0)"
    )
    private Long studentsCount;

    @NotNull(message = "Expelled students cannot be null")
    @Positive(message = "Expelled students must be greater than 0")
    @Column(
            name = "expelled_students",
            nullable = false,
            columnDefinition = "BIGINT CHECK (expelled_students > 0)"
    )
    private Long expelledStudents;

    @Positive(message = "Transferred students must be greater than 0")
    @Column(
            name = "transferred_students",
            columnDefinition = "INTEGER CHECK (transferred_students > 0)"
    )
    private Integer transferredStudents;

    @Enumerated(EnumType.STRING)
    @Column(name = "form_of_education")
    private FormOfEducation formOfEducation;

    @NotNull(message = "Should be expelled cannot be null")
    @Positive(message = "Should be expelled must be greater than 0")
    @Column(
            name = "should_be_expelled",
            nullable = false,
            columnDefinition = "INTEGER CHECK (should_be_expelled > 0)"
    )
    private Integer shouldBeExpelled;

    @NotNull(message = "Average mark cannot be null")
    @Positive(message = "Average mark must be greater than 0")
    @Column(
            name = "average_mark",
            nullable = false,
            columnDefinition = "BIGINT CHECK (average_mark > 0)"
    )
    private Long averageMark;

    @Enumerated(EnumType.STRING)
    @Column(name = "semester_enum")
    private Semester semesterEnum;

    @ManyToOne
    @JoinColumn(name = "group_admin_id")
    private Person groupAdmin;

    public StudyGroup() {}

    @PrePersist
    protected void onCreate() {
        if (creationDate == null) {
            creationDate = LocalDateTime.now();
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public Coordinates getCoordinates() { return coordinates; }
    public void setCoordinates(Coordinates coordinates) { this.coordinates = coordinates; }

    public LocalDateTime getCreationDate() { return creationDate; }
    public void setCreationDate(LocalDateTime creationDate) { this.creationDate = creationDate; }

    public Long getStudentsCount() { return studentsCount; }
    public void setStudentsCount(Long studentsCount) { this.studentsCount = studentsCount; }

    public Long getExpelledStudents() { return expelledStudents; }
    public void setExpelledStudents(Long expelledStudents) { this.expelledStudents = expelledStudents; }

    public Integer getTransferredStudents() { return transferredStudents; }
    public void setTransferredStudents(Integer transferredStudents) { this.transferredStudents = transferredStudents; }

    public FormOfEducation getFormOfEducation() { return formOfEducation; }
    public void setFormOfEducation(FormOfEducation formOfEducation) { this.formOfEducation = formOfEducation; }

    public Integer getShouldBeExpelled() { return shouldBeExpelled; }
    public void setShouldBeExpelled(Integer shouldBeExpelled) { this.shouldBeExpelled = shouldBeExpelled; }

    public Long getAverageMark() { return averageMark; }
    public void setAverageMark(Long averageMark) { this.averageMark = averageMark; }

    public Semester getSemesterEnum() { return semesterEnum; }
    public void setSemesterEnum(Semester semesterEnum) { this.semesterEnum = semesterEnum; }

    public Person getGroupAdmin() { return groupAdmin; }
    public void setGroupAdmin(Person groupAdmin) { this.groupAdmin = groupAdmin; }
}
