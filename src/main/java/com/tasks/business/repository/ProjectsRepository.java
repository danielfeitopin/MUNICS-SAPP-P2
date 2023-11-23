package com.tasks.business.repository;

import com.tasks.business.entities.Project;
import org.springframework.data.repository.CrudRepository;

public interface ProjectsRepository extends CrudRepository<Project, Long>{

    public Project findByName(String name);

}
