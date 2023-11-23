package com.tasks.business.entities;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity(name = "Task")
@Table(name = "tasks")
public class Task implements Serializable {

    private static final long serialVersionUID = 8529932393356911006L;    

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long taskId;
    
    @Column(name = "name", nullable = false)
    private String name;
    
    @Column(name = "timestamp", nullable = false)
    private Long timestamp;

    @Column(name = "description")
    private String description;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "state", nullable = false)
    private TaskState state;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "resolution", nullable = false)
    private TaskResolution resolution;
    
    @Column(name = "progress", nullable = false)
    private Byte progress;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "type", nullable = false)
    private TaskType type;
    
    @ManyToOne()
    @JoinColumn(name = "ownerId", nullable = false)
    private User owner;
    
    @OneToMany(mappedBy = "task", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Comment> comments = new ArrayList<>();

    @ManyToOne()
    @JoinColumn(name = "projectId", nullable = false)
    private Project project;
    
    public Long getTaskId() {
        return taskId;
    }

    public void setTaskId(Long taskId) {
        this.taskId = taskId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Long getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(Long timestamp) {
        this.timestamp = timestamp;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public TaskState getState() {
        return state;
    }

    public void setState(TaskState state) {
        this.state = state;
    }
    
    public TaskResolution getResolution() {
        return resolution;
    }

    public void setResolution(TaskResolution resolution) {
        this.resolution = resolution;
    }

    public TaskType getType() {
        return type;
    }

    public void setType(TaskType type) {
        this.type = type;
    }

    public User getOwner() {
        return owner;
    }

    public void setOwner(User owner) {
        this.owner = owner;
    }

    public List<Comment> getComments() {
        return comments;
    }

    public void setComments(List<Comment> comments) {
        this.comments = comments;
    }

    public Project getProject() {
        return project;
    }

    public void setProject(Project project) {
        this.project = project;
    }

    public Byte getProgress() {
        return progress;
    }

    public void setProgress(Byte progress) {
        this.progress = progress;
    }
    
}
