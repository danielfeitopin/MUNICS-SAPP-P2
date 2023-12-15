package com.tasks.business;

import com.tasks.business.entities.Project;
import com.tasks.business.entities.User;
import com.tasks.business.exceptions.DuplicatedResourceException;
import com.tasks.business.exceptions.InstanceNotFoundException;
import com.tasks.business.exceptions.PermissionException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.tasks.business.repository.ProjectsRepository;
import com.tasks.business.repository.UsersRepository;
import java.text.MessageFormat;
import java.util.Objects;
import java.util.Optional;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ProjectService {
    
    @Autowired
    private ProjectsRepository projectsRepository;
    
    @Autowired
    private UsersRepository userRepository;
    
    @Transactional
    public Project create(String name, String description, String username) 
            throws DuplicatedResourceException, UsernameNotFoundException {
        Optional<User> user = userRepository.findById(username);
        if(!user.isPresent()) {
            throw new UsernameNotFoundException(MessageFormat.format("User {0} does not exist", username));
        }
        if(projectsRepository.findByName(name) != null) {
            throw new DuplicatedResourceException("Project", name,
                MessageFormat.format("Project ''{0}'' already exists", name));
        }
        Project project = new Project();
        project.setName(name);
        project.setDescription(description);
        project.setTimestamp(System.currentTimeMillis());
        project.setTasksCount(0);
        project.setAdmin(user.get());
        return projectsRepository.save(project);
    }

    @Transactional
    public Project update(String callerName, Long projectId, String name, String description)
            throws DuplicatedResourceException, InstanceNotFoundException, PermissionException {
        Optional<Project> optProject = projectsRepository.findById(projectId);
        if(!optProject.isPresent()) {
            throw new InstanceNotFoundException(projectId, "Project", 
                    MessageFormat.format("Project {0} does not exist", projectId));
        }
        Project anotherProject = projectsRepository.findByName(name);
        if(anotherProject != null && !Objects.equals(anotherProject.getProjectId(), projectId)) {
            throw new DuplicatedResourceException("Project", name, 
                MessageFormat.format("Project ''{0}'' already exists", name));
        }
        Project project = optProject.get();
        if (project.getAdmin().getUsername().equals(callerName)) {
            project.setName(name);
            project.setDescription(description);
            project.setTimestamp(System.currentTimeMillis());
            return projectsRepository.save(project);
        } else {
            throw new PermissionException();
        }
    }
    
    @Transactional()
    public void removeById(String callerName, Long id) throws InstanceNotFoundException, PermissionException {
        Optional<Project> optProject = projectsRepository.findById(id);
        if(!optProject.isPresent()) {
            throw new InstanceNotFoundException(id, "Project" , MessageFormat.format("Project {0} does not exist", id));
        }
        Project project = optProject.get();
        if (project.getAdmin().getUsername().equals(callerName)) {
            projectsRepository.delete(project);
        } else {
            throw new PermissionException();
        }
    }
    
    @Transactional(readOnly = true)
    public Project findById(Long id) throws InstanceNotFoundException {
        Optional<Project> project = projectsRepository.findById(id);
        if(!project.isPresent()) {
            throw new InstanceNotFoundException(id, "Task" , MessageFormat.format("Project {0} does not exist", id));
        }
        return project.get();
    }
    
    @Transactional(readOnly = true)
    public Iterable<Project> findAll() {
        return projectsRepository.findAll();
    }
    
}
