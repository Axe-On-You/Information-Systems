package com.lab.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;

@Entity
@Table(name = "coordinates")
public class Coordinates {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "X coordinate cannot be null")
    @Column(name = "x", nullable = false)
    private Long x;

    @NotNull(message = "Y coordinate cannot be null")
    @Column(name = "y", nullable = false)
    private Long y;

    public Coordinates() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getX() { return x; }
    public void setX(Long x) { this.x = x; }

    public Long getY() { return y; }
    public void setY(Long y) { this.y = y; }
}