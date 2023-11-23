package com.tasks.business;

import com.tasks.business.entities.Comment;
import com.tasks.business.entities.Project;
import com.tasks.business.entities.Task;
import com.tasks.business.entities.TaskResolution;
import com.tasks.business.entities.TaskState;
import com.tasks.business.entities.TaskType;
import com.tasks.business.entities.User;
import com.tasks.business.exceptions.DuplicatedResourceException;
import com.tasks.business.exceptions.InalidStateException;
import com.tasks.business.exceptions.InstanceNotFoundException;
import com.tasks.business.repository.CommentsRepository;
import com.tasks.business.repository.ProjectsRepository;
import com.tasks.business.repository.TasksRepository;
import com.tasks.business.repository.UsersRepository;
import java.text.MessageFormat;
import java.util.Objects;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class TasksService {
    
    @Autowired
    private TasksRepository tasksRepository;
    
    @Autowired
    private CommentsRepository commentsRepository;
    
    @Autowired
    private UsersRepository userRepository;
    
    @Autowired
    private ProjectsRepository projectsRepository;
    
    @Transactional
    public Task create(String name, String description, String type, String username, Long projectId) 
            throws DuplicatedResourceException, InstanceNotFoundException {
        Optional<User> user = userRepository.findById(username);
        if(!user.isPresent()) {
            throw new UsernameNotFoundException(MessageFormat.format("User {0} does not exist", username));
        }
        Optional<Project> project = projectsRepository.findById(projectId);
        if(!project.isPresent()) {
            throw new InstanceNotFoundException(projectId, "Project", 
                    MessageFormat.format("Project {0} does not exist", projectId));
        }
        if(tasksRepository.findByName(name) != null) {
            throw new DuplicatedResourceException("Task", name, 
                MessageFormat.format("Task ''{0}'' already exists", name));
        }
        
        Project projectToUpdate = project.get();
        projectToUpdate.setTasksCount(projectToUpdate.getTasksCount() + 1);
        projectsRepository.save(projectToUpdate);
        
        Task task = new Task();
        task.setName(name);
        task.setDescription(description);
        task.setType(TaskType.valueOf(type));
        task.setOwner(user.get());
        task.setTimestamp(System.currentTimeMillis());
        task.setState(TaskState.OPEN);
        task.setResolution(TaskResolution.NEW);
        task.setProject(project.get());
        task.setProgress((byte)0);
        return tasksRepository.save(task);
    }
    
    @Transactional
    public Task update(Long id, String name, String description, String type, String username, Long projectId) 
        throws InstanceNotFoundException, InalidStateException, DuplicatedResourceException {
        Optional<User> user = userRepository.findById(username);
        if(!user.isPresent()) {
            throw new UsernameNotFoundException(MessageFormat.format("User {0} does not exist", username));
        }
        Optional<Project> project = projectsRepository.findById(projectId);
        if(!project.isPresent()) {
            throw new InstanceNotFoundException(projectId, "Project", 
                    MessageFormat.format("Project {0} does not exist", projectId));
        }
        Optional<Task> task = tasksRepository.findById(id);
        if(!task.isPresent()) {
            throw new InstanceNotFoundException(id, "Task" , MessageFormat.format("Task {0} does not exist", id));
        }
        Task anotherTask = tasksRepository.findByName(name);
        if(anotherTask != null && !Objects.equals(anotherTask.getTaskId(), id)) {
            throw new DuplicatedResourceException("Task", name, 
                MessageFormat.format("Task ''{0}'' already exists", name));
        }
        Task taskToUpdate = task.get();
        if(taskToUpdate.getState().equals(TaskState.CLOSED)) {
            throw new InalidStateException("Task " + taskToUpdate.getName() + " is closed.");
        }
        Project prevProject = taskToUpdate.getProject();
        if(!prevProject.getProjectId().equals(projectId)) {
            prevProject.setTasksCount(prevProject.getTasksCount() - 1);
            Project newProject = project.get();
            newProject.setTasksCount(newProject.getTasksCount() + 1);
            taskToUpdate.setProject(newProject);
            
            projectsRepository.save(prevProject);
            projectsRepository.save(newProject);
        }
                
        taskToUpdate.setName(name);
        taskToUpdate.setDescription(description);
        taskToUpdate.setType(TaskType.valueOf(type));
        taskToUpdate.setOwner(user.get());
        return tasksRepository.save(taskToUpdate);
    }    

    @Transactional
    public Task changeResolution(Long id, TaskResolution resolution) 
            throws InstanceNotFoundException, InalidStateException {
        Optional<Task> optTask = tasksRepository.findById(id);
        if(!optTask.isPresent()) {
            throw new InstanceNotFoundException(id, "Task" , MessageFormat.format("Task {0} does not exist", id));
        }
        Task task = optTask.get();
        if(task.getState().equals(TaskState.CLOSED)) {
            throw new InalidStateException("Task " + task.getName() + " is closed.");
        }
        task.setResolution(resolution);
        return tasksRepository.save(task);
    }
    
    @Transactional
    public Task changeProgress(Long id, byte progress) 
            throws InstanceNotFoundException, InalidStateException {
        Optional<Task> optTask = tasksRepository.findById(id);
        if(!optTask.isPresent()) {
            throw new InstanceNotFoundException(id, "Task" , MessageFormat.format("Task {0} does not exist", id));
        }
        Task task = optTask.get();
        if(task.getState().equals(TaskState.CLOSED)) {
            throw new InalidStateException("Task " + task.getName() + " is closed.");
        }
        if(!task.getResolution().equals(TaskResolution.IN_PROGRESS)) {
            throw new InalidStateException("Task " + task.getName() + " is not in progress.");
        }
        task.setProgress(progress);
        return tasksRepository.save(task);
    }
    
    @Transactional
    public Task changeState(Long id, TaskState state)  throws InstanceNotFoundException {
        
        Optional<Task> optTask = tasksRepository.findById(id);
        if(!optTask.isPresent()) {
            throw new InstanceNotFoundException(id, "Task" , MessageFormat.format("Task {0} does not exist", id));
        }
        Task task = optTask.get();
        task.setState(state);
        return tasksRepository.save(task);
    } 
    
    @Transactional(readOnly = true)
    public Iterable<Task> findAll() {
        return tasksRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Iterable<Task> findByOwner(String owner) {
        Optional<User> optUser = userRepository.findById(owner);
        if(!optUser.isPresent()) {
            throw new UsernameNotFoundException(MessageFormat.format("User {0} does not exist", owner));
        }
        return tasksRepository.findByOwner(optUser.get());
    }

    @Transactional(readOnly = true)
    public Iterable<Task> findByProjectId(Long projectId) throws InstanceNotFoundException {
        Optional<Project> project = projectsRepository.findById(projectId);
        if(!project.isPresent()) {
            throw new InstanceNotFoundException(projectId, "Project", 
                MessageFormat.format("Project {0} does not exist", projectId));
        }
        return tasksRepository.findByProject(project.get());
    }
    
    @Transactional(readOnly = true)
    public Task findById(Long id) throws InstanceNotFoundException {
        Optional<Task> optTask = tasksRepository.findById(id);
        if(!optTask.isPresent()) {
            throw new InstanceNotFoundException(id, "Task" , MessageFormat.format("Task {0} does not exist", id));
        }
        return optTask.get();
    }

    @Transactional()
    public void removeById(Long id) throws InstanceNotFoundException {
        Optional<Task> optTask = tasksRepository.findById(id);
        if(!optTask.isPresent()) {
            throw new InstanceNotFoundException(id, "Task" , MessageFormat.format("Task {0} does not exist", id));
        }
        tasksRepository.delete(optTask.get());
    }
    
    @Transactional
    public Comment addComment(Long taskId, String user, String text) 
            throws InstanceNotFoundException, InalidStateException {
        Optional<User> optUser = userRepository.findById(user);
        if(!optUser.isPresent()) {
            throw new UsernameNotFoundException(MessageFormat.format("User {0} does not exist", user));
        }
        Optional<Task> optTask = tasksRepository.findById(taskId);
        if(!optTask.isPresent()) {
            throw new InstanceNotFoundException(taskId, "Task", MessageFormat.format("Task {0} does not exist", taskId));
        }
        Task task = optTask.get();
        if(task.getState().equals(TaskState.CLOSED)) {
            throw new InalidStateException("Task " + task.getName() + " is closed.");
        }
        Comment comment = new Comment();
        comment.setText(text);
        comment.setUser(optUser.get());
        comment.setTimestamp(System.currentTimeMillis());
        comment.setTask(optTask.get());
        
        return commentsRepository.save(comment);
    }
    
    @Transactional(readOnly = true)
    public Comment findCommentById(Long id) throws InstanceNotFoundException {
        Optional<Comment> optComment = commentsRepository.findById(id);
        if(!optComment.isPresent()) {
            throw new InstanceNotFoundException(id, "Comment" , MessageFormat.format("Comment {0} does not exist", id));
        }
        return optComment.get();
    }    
}
