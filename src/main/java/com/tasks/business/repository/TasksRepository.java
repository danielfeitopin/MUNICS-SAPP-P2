package com.tasks.business.repository;

import com.tasks.business.entities.Project;
import com.tasks.business.entities.Task;
import com.tasks.business.entities.User;
import org.springframework.data.repository.CrudRepository;

public interface TasksRepository extends CrudRepository<Task, Long>{
    
    public Iterable<Task> findByProject(Project project);
    public Iterable<Task> findByOwner(User owner);
    public Task findByName(String name);

}
