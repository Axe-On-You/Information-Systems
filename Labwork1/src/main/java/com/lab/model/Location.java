package com.lab.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;

@Entity
@Table(name = "location")
public class Location {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "Location X cannot be null")
    @Column(name = "x", nullable = false)
    private Double x;

    @NotNull(message = "Location Y cannot be null")
    @Column(name = "y", nullable = false)
    private Integer y;

    @NotNull(message = "Location name cannot be null")
    @Column(name = "name", nullable = false)
    private String name;

    public Location() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Double getX() { return x; }
    public void setX(Double x) { this.x = x; }

    public Integer getY() { return y; }
    public void setY(Integer y) { this.y = y; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
}